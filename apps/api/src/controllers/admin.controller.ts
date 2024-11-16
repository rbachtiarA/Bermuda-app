import cancelOrder from "@/helpers/cancelOrder"
import prisma from "@/prisma"
import { Order, Payment } from "@prisma/client"
import { Request, Response } from "express"

const getExistingOrder = async (orderId: number) => {
    return await prisma.order.findFirst({
        where: {
            id: +orderId,
        }
    })
}
const updateOrder = async (orderId: number, data: Partial<Order>) => {
    return await prisma.order.update({
        where: { id: orderId },
        data
    })
}
export class AdminController {
    async getIsAdmin(req:Request, res:Response) {
        return res.status(200).send({ status: 'ok' })
    }

    async updateDeniedPayment(req: Request, res: Response) {
        try {
            const { orderId } = req.body
            const existOrder = await getExistingOrder(orderId)
            if(!existOrder) throw 'Order is invalid'

            await updateOrder(orderId, {
                paymentProofUrl: null,
                status: 'PendingPayment'
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
            const existOrder = await getExistingOrder(orderId)
            if(!existOrder) throw 'Order is invalid'

            await prisma.order.update({
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
            const existOrder = await getExistingOrder(orderId)
            if(!existOrder) throw 'Order is invalid'

            await updateOrder(orderId, {
                status: 'Cancelled'
            })

            await cancelOrder(orderId)

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
    async updateShippedOrder(req: Request, res: Response) {

        try {
            const { orderId } = req.body
            const userId = req.user?.id
            const existOrder = await getExistingOrder(orderId)
            if(!existOrder) throw 'Order is invalid'

            await updateOrder(orderId, {
                status:'Shipped',
                shippedAt: new Date()
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