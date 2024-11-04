import { json, Request, Response } from 'express';
import  midtrans  from '../services/midtrans.js'
import prisma from '@/prisma';

export class OrderController {
    async createNewOrder(req: Request, res: Response) {
        try {
            const { userId, totalAmount, shippingCost, addressId, methodPayment, storeId } = req.body
            console.log(storeId);
            
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
                    if(existStock!.quantity - item.quantity < 0) throw {code: 'ITEM_INSUFFICIENT', details: `${existStock.product.name} is insuffficient`}

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
                            order_id: `ORDER_${order.id}`,
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
                msg: error
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
    //      if status "settlement" update order status with 'confirmed' and update payment isConfirmed to true & confirmedAt to date.now()
    async getMidtransStatus(req:Request, res: Response) {   
        try {
            const { orderId } = req.params 
            
            //check order exist
            const existOrder = await prisma.order.findUnique({
                where: { id: +orderId }
            })
            if(!existOrder) throw 'Order id is invalid'

            //get midtransStatus, if customer didnt pick one of midtrans service will return 404
            const midtransStatus = await midtrans.snap.transaction.status(`ORDER_${orderId}`)        

            //convert status to converStatus, which for grouping purpose
            const status = midtransStatus?.transaction_status
            const convertStatus = status === 'cancel' || status === 'null' ? 'expire' : status;

            //this condition to prevent unecessary multiple running proccessed
            if((convertStatus === 'expire' && existOrder.status !== 'Cancelled') || (convertStatus === 'settlement' && existOrder.status !== 'Confirmed')) {
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
                        // update status of order to confirmed
                        const updateOrder = await prisma.order.update({
                            where: {
                                id: +orderId
                            },
                            data: {
                                status: 'Confirmed',
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
                midtrans: midtransStatus
            })
        } catch (error) {            
            return res.status(200).send({
                status: 'not_found',
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
                const midtransStatus = await midtrans.snap.transaction.cancel(`ORDER_${existOrder.id}`)
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
                msg: 'not_found',
                error: `${error}`
            })
        }
    }
}
