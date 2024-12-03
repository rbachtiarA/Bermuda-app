import { Request, Response } from 'express';
import prisma from '@/prisma';
import { formatDateMidtrans } from '@/helpers/midtrans-dateformat';
import  midtrans  from '../services/midtrans.js'

export class CreateOrderController {
  async createNewOrder(req: Request, res: Response) {
    let codeError;
    try {
        const { totalAmount, shippingCost, addressId, methodPayment, storeId, discountId, discountAmount } = req.body
        const userId = req.user?.id
        //get user data
        const user = await prisma.user.findUnique({
            where: { id: +userId! }
            
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

        let discountBOGO = null
        if(discountId) {
            discountBOGO = await prisma.discount.findFirst({
                where: { id: +discountId, discountType: 'BUY_ONE_GET_ONE' },
                include: { products: true }
            })
        }
        //convert checkout item to array of {productId, quantity, price, }
        const orderItem = checkoutItem?.CartItem.map((item) => {
            if(discountBOGO) {
                if(item.productId === discountBOGO.productId) {
                    item.quantity++
                }
            }
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
                if(!existStock) {
                    codeError = {code: 'ITEM_INSUFFICIENT', details: `store doesnt have stock`}
                    throw 'Some product stock is invalid'
                }
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
                    userId: user.id,
                    addressId,
                    status: 'PendingPayment',
                    totalAmount: totalAmount,
                    shippingCost: shippingCost,
                    discountId: discountId,
                    storeId,
                    discountAmount: discountBOGO? discountBOGO.products?.price :discountAmount,
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
                // const itemDetails = checkoutItem.CartItem.map((item) => {
                //     return { id: item.productId, name: item.product.name.substring(0,49), quantity: item.quantity, price: item.product.price }
                // })

            //if methodPayment is Gateway, generate token midtrans
            if(order && methodPayment === 'Gateway') {
                
                //midtrans body
                const parameter = {
                    transaction_details: {
                        order_id: `${process.env.PREFIX_ORDERNAME_MIDTRANS}${order.id}`,
                        gross_amount: totalAmount
                    },
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
}
