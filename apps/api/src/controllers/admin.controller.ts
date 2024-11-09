import prisma from "@/prisma"
import { Request, Response } from "express"

const getExistingOrder = async (orderId: number, userId: number) => {
    return await prisma.order.findFirst({
        where: {
            AND: {
                id: +orderId,
                userId: +userId
            }
        }
    })
}
export class AdminController {
    
    async updateDeniedPayment(req: Request, res: Response) {
        try {
            const { orderId } = req.body
            const userId = req.user?.id
            const existOrder = await getExistingOrder(orderId, userId!)
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
            const existOrder = await getExistingOrder(orderId, userId!)
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
            const existOrder = await getExistingOrder(orderId, userId!)
            if(!existOrder) throw 'Order is invalid'

            const updatedOrder = await prisma.order.update({
                where: {
                    id: existOrder.id
                },
                data: {
                    status: 'Cancelled',
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
            const existOrder = await getExistingOrder(orderId, userId!)
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