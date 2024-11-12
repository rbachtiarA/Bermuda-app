import { Request, Response } from 'express';
import  midtrans  from '../services/midtrans.js'
import prisma from '@/prisma';
import cancelOrder from '@/helpers/cancelOrder';

export class OrderController {
    async updatePaymentProof(req: Request, res: Response) {
        try {            
            const { orderId } = req.body
            if(!req?.file) throw 'Please upload validated file'
            const imgLink = `${process.env.IMAGE_STORAGE_URL}paymentProof/${req.file.filename}`

            const updatedOrder = await prisma.order.update({
                where: {id: +orderId!},
                data: {
                    paymentProofUrl: imgLink,
                    status: 'Waiting'
                }
            })
            if(!updatedOrder) throw 'Order is invalid'
            return res.status(200).send({
                status: 'ok',
                msg: imgLink
            })
        } catch (error) {
            return res.status(400).send({
                status: 'error',
                msg: `${error}`
            })
        }
    }

    async getOrderById(req: Request, res: Response) {
        try {
            const userId = req.user?.id
            const { orderId } = req.params
            const order = await prisma.order.findUnique({
                where: {
                    id: +orderId,
                    userId: +userId!
                },
                include: {
                    Payment: true
                }
            })

            if(!order) throw 'Cant find order'
            return res.status(200).send({
                status: 'ok',
                msg: order
            })

        } catch (error) {
            return res.status(401).send({
                status: 'error',
                msg: error
            })
        }
    }

    // get order which have status 'pending', return msg FOUND / NOT FOUND and Order with Order & Payment
    async getPendingOrder(req: Request, res: Response) {
        try {
            const userId = req.user?.id
            const pendingOrder = await prisma.order.findFirst({
                where: { userId: userId, status: 'PendingPayment' }, 
                include : {
                    Payment: true, Address: true,
                    orderItems: {
                        include: {
                            product: true
                        }
                    },
                }
            })
            return res.status(200).send({
                status: 'ok', msg: pendingOrder? 'FOUND' : 'NOT_FOUND', order: pendingOrder
            })
        } catch (error) {
            return res.status(400).send({
                status: 'error',
                msg: error
            })
        }
    }
    
    async getUserOrder(req:Request, res: Response) {
        try {
            const userId = req.user?.id
            const userOrder = await prisma.order.findMany({
                where: {
                    userId: +userId!
                },
                include: {
                    Payment: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
            if(!userOrder) throw "User doesnt have any order"
            
            return res.status(200).send({
                status: 'ok',
                msg: 'Success get data',
                order: userOrder
            })
        } catch (error) {
            return res.status(400).send({
                status: 'error',
                msg: `${error}`
            })
        }
    }
    
    async patchCompletedOrder(req:Request, res: Response) {
        try {
            const { orderId } = req.body
            const userId = req.user?.id
            const existOrder = await prisma.order.findFirst({
                where: {
                    AND: {
                        id: +orderId,
                        userId: +userId!
                    }
                }
            })
            if(!existOrder) throw "User doesnt have any order"
            
            const updatedOrder = await prisma.order.update({
                where: {  id: existOrder.id },
                data: { status: 'Completed' }
            })
            
            return res.status(200).send({
                status: 'ok',
                msg: 'Success update order',
            })
        } catch (error) {
            return res.status(401).send({
                status: 'error',
                msg: `${error}`
            })
        }
    }

    async userCancelOrder(req:Request, res: Response) {
        try {
            const { orderId } = req.body
            const userId = req.user?.id
            
            const existOrder = await prisma.order.findFirst({
                where: {
                    AND: {
                        id: +orderId,
                        userId: +userId!
                    }
                },
                include: {
                    Payment: true,
                    Store:true,
                }
            })
            
            if(!existOrder) throw 'Order is Invalid'
            const isExpired = Date.parse(String(existOrder.Payment?.expiredDate)) < Date.now()
            if(existOrder.Payment?.paymentMethod === 'Gateway' && !isExpired) {
                //cancel midtrans
                const midtransStatus = await midtrans.snap.transaction.cancel(`ORDER_A${existOrder.id}`)
            }
            
            if(existOrder.paymentProofUrl !== null) throw 'You already have uploaded payment proof'

            await cancelOrder(orderId)

            return res.status(200).send({
                status: 'ok',
                msg: 'Cancel payment success'
            })
        } catch (error) {
            return res.status(400).send({
                status: 'error',
                msg: 'NOT_FOUND',
                error: `${error}`
            })
        }
    }
    // get midtrans transaction status, from 'orderId', 
    //      if order is expired, update order status with 'cancelled', and return all order items quantity to store quantity
    //      if status "settlement" update order status with 'Proccessed' and update payment isConfirmed to true & confirmedAt to date.now()
    async getMidtransStatus(req:Request, res: Response) {   
        try {
            let midtransStatus;
            const { orderId } = req.params 
            
            //check order exist
            const existOrder = await prisma.order.findUnique({
                where: { id: +orderId },
                include: { Payment: true }
            })
            if(!existOrder) throw 'Order id is invalid'
            if(existOrder.Payment?.expiredDate! < new Date() && existOrder.status !== 'PendingPayment') {
                await cancelOrder(existOrder.id)
            } else {
                //get midtransStatus, if customer didnt pick one of midtrans service will return 200 with NOT_FOUND
                try {
                    const midtransOrder = await midtrans.snap.transaction.status(`ORDER_A${orderId}`)        
                    //status will be 'settlement' | 'pending'
                    midtransStatus = midtransOrder?.transaction_status
                    if(midtransStatus === 'settlement') {
                        await prisma.order.update({
                            where: {
                                id: +orderId
                            },
                            data: {
                                status: 'Proccessed',
                                Payment: {
                                    update: {
                                        isConfirmed: true,
                                        confirmedAt: new Date(Date.now())
                                    }
                                }
                            }
                        })
                    }
                } catch (error) {
                    return res.status(200).send({
                        status: 'NOT_FOUND',
                        msg:'You need to select your transaction service first'
                    })
                }
            }
            
            return res.status(200).send({
                status: 'ok',
                midtrans: midtransStatus
            })
        } catch (error) {        
            return res.status(400).send({
                status: 'error', 
                msg:`something is error : ${error}`,
            })
        }


    }
}
