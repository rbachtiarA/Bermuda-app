import { Request, Response } from 'express';
import prisma from '@/prisma';


export class OrderController {
    async createNewOrder(req: Request, res: Response) {
        try {
            const { userId, totalAmount, addressId, methodPayment } = req.body
            
            //checkout is array of {productId, quantity, price}
            const { checkout }: { checkout: {productId: number, addressId: number, price: number}[] } = req.body
            const convertToOrderItems = checkout.map((item) => item)
            //get user
            const user = await prisma.user.findUnique({
                where: { id: +userId }
            })
            if(!user) throw 'User not valid'

            //create order, payment, and orderItem
            const order = await prisma.order.create({
                data: {
                    userId,
                    addressId,
                    status: methodPayment === 'PAYMENT_GATEWAY'? 'Confirmed' : 'PendingPayment',
                    totalAmount,
                    shippingOptionId: 1,
                    Payment: {
                        create: {
                            amountPaid: totalAmount,
                            paymentMethod: methodPayment,
                            isConfirmed: methodPayment === 'PAYMENT_GATEWAY'? true : false,
                            confirmedAt: methodPayment === 'PAYMENT_GATEWAY'? new Date() : null,
                        }
                    },
                    orderItems: {
                        createMany: {
                            data: [
                                // {productId, quantity, price, discountValue}
                            ]
                        }
                    }
                }
            })


        } catch (error) {
            
        }
    }
}
