import { Request, Response } from 'express';
import prisma from '@/prisma';

//not needed yet
export class DiscountController {
  async getAvailableDiscountOnCheckout(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { storeId } = req.params
      const checkoutItems = await prisma.checkout.findFirst({
        where: {
          userId: +userId!
        },
        select: {
          CartItem: {
            select: {
              product: { 
                select: {
                  id: true
              } }
            }
          }
        }
      })
      const productIds = checkoutItems?.CartItem.map((item) => item.product.id)
      console.log(productIds);
      const discount = await prisma.discount.findMany({
        where: {
          OR: [
            {
              AND: {
                storeId: +storeId,
                productId: null,
                userId: null
              },
            },
            {
              AND: {
                productId: {
                  in: productIds
                },
                storeId: +storeId
              }
            }
          ]  
        },
      })      
      
      if(!checkoutItems) throw 'Something wrong when check your cart'

      console.log(checkoutItems);
      
      return res.status(200).send({
        status: 'ok',
        discount
      })
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        msg: error
      })
    }
  }
}
