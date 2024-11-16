import { Request, Response } from 'express';
import prisma from '@/prisma';

//not needed yet
export class StoreController {
    async getStoreStocks(req: Request, res: Response) {
        try {
        const { storeId } = req.params
        
        const store = await prisma.store.findUnique({
            where: { id: +storeId },
            select: {
                stocks: {
                    include: {
                        product: true
                    }
                }
            }
        })
        if(!store) throw 'There is Error for displaying product'

        return res.status(200).send({
            stock: store.stocks
        })
        } catch (error) {
        return res.status(400).send({
            status: 'error',
            msg: error
        })
        }
    }

    async getStoreOrders(req:Request, res: Response) {
        try {
            //change this when verification user implemented, get storeId from user store
            const userId = req.user?.id
            const role = req.user?.role
            let storeOrder;
            if(role === 'SUPER_ADMIN') {
                storeOrder = await prisma.order.findMany({
                    include: {Payment: true},
                    orderBy: {createdAt: 'desc'}
                })
            } else {
                const admin = await prisma.user.findUnique({
                    where: { id: +userId! }
                })
                if(!admin) throw 'Admin is invalid'
                storeOrder = await prisma.order.findMany({
                    where: {
                        storeId: admin?.storeId!
                    },
                    include: {
                        Payment: true
                    },
                    orderBy: {createdAt: 'desc'}
                })           
            }
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
