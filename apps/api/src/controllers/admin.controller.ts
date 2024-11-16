import prisma from "@/prisma"
import { Request, Response } from "express"

const getExistingOrder = async (orderId: number) => {
    return await prisma.order.findFirst({
        where: {
            id: orderId,
        }
    })
}
export class AdminController {
    
    async updateDeniedPayment(req: Request, res: Response) {
        try {
            const { orderId } = req.body
            const userId = req.user?.id
            const existOrder = await getExistingOrder(orderId)
            if(!existOrder) throw 'Order is invalid'

            const updatedOrder = await prisma.order.update({
                where: {
                    id: existOrder.id
                },
                data: {
                    paymentProofUrl: null,
                    status: 'PendingPayment'
                }
            })
            return res.status(200).send({
                status: 'ok',
                msg: 'success update order'
            })
        } catch (error) {
            return res.status(401).send({
                status: 'error',
                msg: `${error}`
            })
        }
    }
    async updateAcceptedPayment(req: Request, res: Response) {

        try {
            const { orderId } = req.body
            const userId = req.user?.id
            const existOrder = await getExistingOrder(orderId)
            if(!existOrder) throw 'Order is invalid'

            const updatedOrder = await prisma.order.update({
                where: {
                    id: existOrder.id
                },
                data: {
                    status: 'Proccessed',
                    Payment: {
                        update: {
                            confirmedAt: new Date(Date.now()),
                            isConfirmed: true
                        }
                    }
                }
            })
            return res.status(200).send({
                status: 'ok',
                msg: 'success update order'
            })
        } catch (error) {
            return res.status(401).send({
                status: 'error',
                msg: `${error}`
            })
        }
    }
    async updateCanceledOrder(req: Request, res: Response) {

        try {
            const { orderId } = req.body
            const userId = req.user?.id
            const existOrder = await getExistingOrder(orderId)
            if(!existOrder) throw 'Order is invalid'

            const updatedOrder = await prisma.order.update({
                where: {
                    id: existOrder.id
                },
                data: {
                    status: 'Cancelled',
                }
            })

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
                msg: 'success update order'
            })
        } catch (error) {
            console.log(`${error}`);
            
            return res.status(401).send({
                status: 'error',
                msg: `${error}`
            })
        }
    }
    async updateShippedOrder(req: Request, res: Response) {

        try {
            const { orderId } = req.body
            const userId = req.user?.id
            const existOrder = await getExistingOrder(orderId)
            console.log(existOrder)
            if(!existOrder) throw 'Order is invalid'

            const updatedOrder = await prisma.order.update({
                where: {
                    id: existOrder.id
                },
                data: {
                    status: 'Shipped',
                }
            })
            return res.status(200).send({
                status: 'ok',
                msg: 'success update order'
            })
        } catch (error) {
            return res.status(401).send({
                status: 'error',
                msg: `${error}`
            })
        }
    }
}