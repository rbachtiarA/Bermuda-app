import { Request, Response } from 'express';
import prisma from '@/prisma';

//not needed yet
export class StoreController {
  async getStockStore(req: Request, res: Response) {
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
}
