import { Request, Response } from 'express';
import  midtrans  from '../services/midtrans.js'
import prisma from '@/prisma';
import { formatDateMidtrans } from '@/helpers/midtrans-dateformat';

export class OrderController {
    async createNewOrder(req: Request, res: Response) {
        let codeError;
        try {
            const { userId, totalAmount, shippingCost, addressId, methodPayment, storeId } = req.body
            
            //get user data
            const user = await prisma.user.findUnique({
                where: { id: +userId }
                
            })
            if(!user) throw 'User is invalid'

            //get user checkout item
            const checkoutItem = await prisma.checkout.findUnique({
                where: { userId: userId },
                include: {
                    CartItem: {
                        include: {
                            product: true
                        }
                    }
                }
            })
            if(!checkoutItem) throw 'Checkout is invalid'

            //convert checkout item to array of {productId, quantity, price, }
            const orderItem = checkoutItem?.CartItem.map((item) => {
                return { productId: item.productId, quantity: item.quantity, price: item.product.price, discountValue: 0 }
            })
            if(!orderItem) throw 'Order is Invalid'

            
            const order = await prisma.$transaction(async (tx) => {
                //expiredDate
                const HOURS_EXPIRED = 1
                const HOURS_EXPIRED_IN_MS = 60 * 60 * HOURS_EXPIRED * 1000

                //reduce quantity stock
                for (const item of orderItem) {
                    const existStock = await tx.stock.findFirst({
                        where: {
                            AND: {
                                productId: item.productId,
                                storeId: +storeId
                            }
                        },
                        include: {
                            product: true
                        }
                    })
                    if(!existStock) throw 'Some product stock is invalid'
                    if(existStock!.quantity - item.quantity < 0) {
                        codeError = {code: 'ITEM_INSUFFICIENT', details: `${existStock.product.name} is insuffficient`}
                        throw 'Insufficient product stock'
                    } 

                    await tx.stock.update({
                        where: {
                            id: existStock!.id
                        },
                        data: {
                            quantity: existStock!.quantity - item.quantity
                        }
                    })   
                }

                //create order, payment, and orderItem
                const order = await tx.order.create({
                    data: {
                        userId,
                        addressId,
                        status: 'PendingPayment',
                        totalAmount: totalAmount,
                        shippingOptionId: 1,
                        storeId,
                        Payment: {
                            create: {
                                amountPaid: totalAmount,
                                paymentMethod: methodPayment,
                                expiredDate: new Date(Date.now() + HOURS_EXPIRED_IN_MS),
                                isConfirmed: false,
                                confirmedAt: null,
                            }
                        },
                        orderItems: {
                            createMany: {
                                // {productId, quantity, price, discountValue}
                                data: [...orderItem]
                            }
                        }
                    }
                })
                
                //creating midtrans item details
                const itemDetails = checkoutItem.CartItem.map((item) => {
                    return { id: item.productId, name: item.product.name.substring(0,49), quantity: item.quantity, price: item.product.price }
                })

                //if methodPayment is Gateway, generate token midtrans
                if(order && methodPayment === 'Gateway') {
                    
                    //midtrans body
                    const parameter = {
                        transaction_details: {
                            order_id: `ORDER_A${order.id}`,
                            gross_amount: totalAmount
                        },
                        item_details: [...itemDetails, {
                            name: 'shipping Cost',
                            price: shippingCost,
                            quantity: 1
                        }] ,
                        customer_details: {
                            first_name: user.name
                        },
                        expiry: {
                            start_time: formatDateMidtrans(new Date(Date.now())),
                            unit: "hour",
                            duration: HOURS_EXPIRED
                        }
                    }
                    
                    const midtransTransaction = await midtrans.snap.createTransaction(parameter)
                    
                    if(!midtransTransaction) throw 'error on creating midtrans token'
                    const payment = await tx.payment.update({
                        where: {
                            orderId: order.id
                        },
                        data: {
                            token: midtransTransaction.token
                        }
                    })
                }

                return { order }
            })
            
            return res.status(201).send({
                status: 'order success',
                order
            })
        } catch (error) {
            return res.status(400).send({
                status: 'error',
                msg: codeError,
                error: `${error}`
            })
        }
    }

    async updatePaymentProof(req: Request, res: Response) {
        try {            
            const { orderId } = req.body
            if(!req?.file) throw 'Please upload validated file'
            const imgLink = `${process.env.IMAGE_STORAGE_URL}paymentProof/${req.file.filename}`

            const existOrder = await prisma.order.findUnique({
                where: { id: +orderId }
            })
            if(!existOrder) throw 'Order is invalid'

            const updatedOrder = await prisma.order.update({
                where: {id: existOrder.id},
                data: {
                    paymentProofUrl: imgLink,
                    status: 'Waiting'
                }
            })

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
            const { userId, orderId } = req.params
            const order = await prisma.order.findUnique({
                where: {
                    id: +orderId,
                    userId: +userId
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
            const { userId } = req.params
            const user = await prisma.user.findUnique({
                where: {
                    id: +userId
                }
            })
            if(!user) throw 'User is not valid'

            const pendingOrder = await prisma.order.findFirst({
                where: {
                    userId: user.id,
                    status: 'PendingPayment'
                }, 
                include : {
                    Payment: true,
                    Address: true,
                    orderItems: {
                        include: {
                            product: true
                        }
                    },
                }
            })

            let responseSend;
            if(pendingOrder) {
                responseSend = { status: 'ok', msg: 'FOUND', order: pendingOrder }
            } else {
                responseSend = { status: 'ok', msg: 'NOTFOUND' }
            }

            return res.status(200).send(responseSend)
            
        } catch (error) {
            return res.status(400).send({
                status: 'error',
                msg: error
            })
        }
    }

    // get midtrans transaction status, from 'orderId', 
    //      if status "expire" or "cancel" update order status with 'cancelled', and return all order items quantity to store quantity
    //      if status "settlement" update order status with 'Proccessed' and update payment isConfirmed to true & confirmedAt to date.now()
    async getMidtransStatus(req:Request, res: Response) {   
        try {
            const { orderId } = req.params 
            
            //check order exist
            const existOrder = await prisma.order.findUnique({
                where: { id: +orderId }
            })
            if(!existOrder) throw 'Order id is invalid'

            //get midtransStatus, if customer didnt pick one of midtrans service will return 404
            const midtransStatus = await midtrans.snap.transaction.status(`ORDER_A${orderId}`)        

            //convert status to converStatus, which for grouping purpose
            const status = midtransStatus?.transaction_status
            const convertStatus = status === 'cancel' || status === 'null' ? 'expire' : status;

            //this condition to prevent unecessary multiple running proccessed
            if((convertStatus === 'expire' && existOrder.status !== 'Cancelled') || (convertStatus === 'settlement' && existOrder.status !== 'Proccessed')) {
                switch (convertStatus) {
                    // if expire, status transaction will be 'cancelled' and any ordered items quantity will revert back to stock store
                    case 'expire':
                        console.log('proccess of cancelling order');
                        
                        await prisma.$transaction(async (tx) => {
                            const updatedOrder = await tx.order.update({
                                where: { id: +orderId },
                                include: { orderItems: true },
                                data: {
                                    status: 'Cancelled',
                                }
                            })

                            // code for update store quantity with cancelled order Items
                            const cancelledOrderItems = updatedOrder.orderItems.map((item) => {
                                return { productId: item.productId, quantity: item.quantity }
                            })
                            
                            // update all quantity stock back to store
                            for (const item of cancelledOrderItems) {
                                const existStock = await tx.stock.findFirst({
                                    where: {
                                        AND: {
                                            productId: item.productId,
                                            storeId: updatedOrder.storeId
                                        }
                                    }
                                })
                                if(!existStock) throw 'Something wrong when addedd product quantity to store'

                                await tx.stock.update({
                                    where: { id: existStock.id },
                                    data: { quantity: existStock.quantity + item.quantity }
                                })
                            } 
                        })
                        
                        break;
                    
                    case 'settlement':
                        // update status of order to processed
                        const updateOrder = await prisma.order.update({
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
                    default:
                        break;
                }
            }
            
            return res.status(200).send({
                status: 'ok',
                midtrans: midtransStatus.transaction_status
            })
        } catch (error) {            
            return res.status(200).send({
                status: 'NOT_FOUND',
                midtrans: null, 
                msg:'You need to select your transaction service first',
            })
        }


    }

    async cancelOrder(req:Request, res: Response) {
        try {
            const { orderId } = req.body
            const existOrder = await prisma.order.findUnique({
                where: {
                    id: +orderId
                },
                include: {
                    Payment: true,
                    Store:true,
                }
            })
            if(!existOrder) throw 'Order is Invalid'
            if(existOrder.status !== 'PendingPayment') throw 'You cannot cancel payment anymore'
            if(existOrder.Payment?.paymentMethod === 'Gateway') {
                //cancel midtrans
                const midtransStatus = await midtrans.snap.transaction.cancel(`ORDER_A${existOrder.id}`)
            }
            
            if(existOrder.paymentProofUrl !== null) throw 'You already have uploaded payment proof'

            await prisma.$transaction(async (tx) => {
                const updatedOrder = await tx.order.update({
                    where: { id: +orderId },
                    include: { orderItems: true },
                    data: {
                        status: 'Cancelled',
                    }
                })

                // code for update store quantity with cancelled order Items
                const cancelledOrderItems = updatedOrder.orderItems.map((item) => {
                    return { productId: item.productId, quantity: item.quantity }
                })
                
                // update all quantity stock back to store
                for (const item of cancelledOrderItems) {
                    const existStock = await tx.stock.findFirst({
                        where: {
                            AND: {
                                productId: item.productId,
                                storeId: updatedOrder.storeId
                            }
                        }
                    })
                    if(!existStock) throw 'Something wrong when addedd product quantity to store'

                    await tx.stock.update({
                        where: { id: existStock.id },
                        data: { quantity: existStock.quantity + item.quantity }
                    })
                } 
            })

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

    async getUserOrder(req:Request, res: Response) {
        try {
            const { userId } = req.params
            const userOrder = await prisma.order.findMany({
                where: {
                    userId: +userId
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

    async getStoreOrder(req:Request, res: Response) {
        try {
            //change this when verification user implemented, get storeId from user store
            const { userId } = req.params
            const admin = await prisma.user.findFirst({
                where: {
                    AND:{
                        id: +userId,
                        role: 'STORE_ADMIN'
                    }
                }
            })
            if(!admin) return res.status(401).send({status: 'error', msg: 'Unauthoritized user'}) 

            const storeOrder = await prisma.order.findMany({
                where: {
                    storeId: admin?.storeId!
                },
                include: {
                    Payment: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
            if(!storeOrder) return res.status(200).send({status: 'ok', msg: 'there is no order in this store'})

            return res.status(200).send({
                status: 'ok',
                msg: 'Success get data',
                order: storeOrder
            })
        } catch (error) {
            return res.status(400).send({
                status: 'error',
                msg: `${error}`
            })
        }
    }
}
