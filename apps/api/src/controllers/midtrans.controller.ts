import cancelOrder from "@/helpers/cancelOrder";
import prisma from "@/prisma";
import { Request, Response } from "express";
import midtrans from '../services/midtrans'
import confirmedOrder from "@/helpers/confirmedOrder";
export class MidtransController {
    // get midtrans transaction status, from 'orderId', 
    //      if order is expired, update order status with 'cancelled', and return all order items quantity to store quantity
    //      if status "settlement" update order status with 'Proccessed' and update payment isConfirmed to true & confirmedAt to date.now()
    async getMidtransStatus(req:Request, res: Response) {   
        try {
            console.log('hello');
            
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
                    const midtransOrder = await midtrans.snap.transaction.status(`${process.env.PREFIX_ORDERNAME_MIDTRANS}${orderId}`)        
                    //status will be 'settlement' | 'pending'
                    midtransStatus = midtransOrder?.transaction_status
                    if(midtransStatus === 'settlement') {
                        const updatedOrder = await prisma.order.update({
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
                            },
                            include: {
                                orderItems: true
                            }
                        })

                        await confirmedOrder(updatedOrder.id)
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