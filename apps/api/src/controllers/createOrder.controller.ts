import { Request, Response } from 'express';
import prisma from '@/prisma';
import { formatDateMidtrans } from '@/helpers/midtrans-dateformat';
import  midtrans  from '../services/midtrans'

export class CreateOrderController {
  async createNewOrder(req: Request, res: Response) {
    let codeError = {code: 'SERVER_ERROR', details: 'Something is wrong, please try again later'}
    //expiredDate
    const HOURS_EXPIRED = 1
    const HOURS_EXPIRED_IN_MS = 60 * 60 * HOURS_EXPIRED * 1000
    try {
        const { totalAmount, shippingCost, addressId, methodPayment, storeId, discountId, discountAmount } = req.body
        const userId = req.user?.id
        
        //get user data & checkout items
        const user = await prisma.user.findUnique({
            where: { id: +userId! },
            include: {
                checkout: {
                    include: {
                        CartItem: {
                            include: {
                                product: {
                                    include: {
                                        stock: {
                                            where: {
                                                storeId: +storeId
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orders: {
                    where: {
                        status: 'PendingPayment'
                    }
                }
            }
        })
        
        if(!user) throw 'User is invalid'
        if(user.orders.length !== 0) {
            codeError = { code: 'ACTIVE_PAYMENT' , details: 'You have order that need to be paid first, select "Account" then go to "Active Payment"'}
            throw 'Pending order found'
        }

        let discountBOGO = null
        if(discountId) {
            discountBOGO = await prisma.discount.findFirst({
                where: { id: +discountId, discountType: 'BUY_ONE_GET_ONE' },
                include: { products: true }
            })
        }
        //convert checkout item to array of {productId, quantity, price, }
        const orderItem = user.checkout?.CartItem?.map((item) => {
            if(discountBOGO) {
                if(item.productId === discountBOGO.productId) {
                    item.quantity++
                }
            }
            return { productId: item.productId, quantity: item.quantity, price: item.product.price, discountValue: 0 }
        })
        
        if(!orderItem) throw 'Order is Invalid'

        const { order, token } = await prisma.$transaction(async (tx) => {
            
            //reduce quantity stock
            for (const item of orderItem) {
                
                //select user checkout item stock from store origins
                const existStock = user.checkout?.CartItem.find((item) => item.product.stock[0].storeId === storeId)

                //check if item stock exist in store
                if(!existStock) {
                    codeError = {code: 'ITEM_INSUFFICIENT', details: `store doesnt have stock`}
                    throw 'Some product stock is invalid'
                }

                //update stock with decrement of item quantity
                const stock = await tx.stock.update({
                    where: {
                        id: existStock.product.stock[0].id
                    },
                    data: {
                        quantity: {
                            decrement: item.quantity
                        }
                    }
                })
                
                //check is stock sufficient
                if(stock.quantity < 0) {
                    codeError = {code: 'ITEM_INSUFFICIENT', details: `${existStock.product.name} is insuffficient`}
                    throw 'Insufficient product stock'
                }
            }

            //create order, payment, and orderItem
            const neworder = await tx.order.create({
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

            //if methodPayment is Gateway, generate token midtrans
            let token = null
            if(neworder && methodPayment === 'Gateway') {
                
                //midtrans body
                const parameter = {
                    transaction_details: {
                        order_id: `${process.env.PREFIX_ORDERNAME_MIDTRANS}${neworder.id}`,
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
                if(!midtransTransaction) {
                    codeError = {code: 'SERVER_ERROR', details:'Something Wrong, please try again'}
                    throw 'error on creating midtrans token'
                }
                token = midtransTransaction.token
                await tx.payment.update({
                    where: {
                        orderId: neworder.id
                    },
                    data: {
                        token: midtransTransaction.token
                    }
                })
            }            
            return { order: neworder, token: token }
        })
        
        return res.status(201).send({
            status: 'ok',
            msg: methodPayment === 'Gateway'? token : 'Success create new order'
        })
    } catch (error) {
        return res.status(400).send({
            status: 'error',
            msg: codeError,
            // error: `${error}`
        })
    }
}
}
