import prisma from '@/prisma';
import { Request, Response } from 'express';

export class CheckoutController{
    async getCheckoutByUserId(req:Request, res:Response) {
        const userId = req.user?.id
        const data = await prisma.checkout.findUnique({
          select: { CartItem: {
            include: { product: { include: {stock: true}} }
          } },
          where: {
            userId: +userId!
          }
        })
    
        return res.status(200).send({status: 'ok', data: data})
      }

      // update cartItem checkout and remove Checkout from cart Item
      async updateCheckoutCartItem(req: Request, res: Response) {
        try {
          const { selectedIds } = req.body
          const userId = req.user?.id
          //verify is userId valid,and then return checkoutId
          const userCheckoutId = await prisma.user.findUnique({
            where: { id: +userId!},
            select: {
              checkout: {
                select: {
                  id: true
                }
              }
            }
          })
          if(!userCheckoutId) throw 'Invalid user'
    
          //update every cart item inside user cart checkout to null
          const previousSelectedItem = await prisma.checkout.update({
            where: {
              id: userCheckoutId.checkout?.id
            },
            data: {
              CartItem: {
                set: []
              }
            } 
          })
    
          //update cartItem which id inside selectedIds
          const updatedData = await prisma.cartItem.updateMany({
            where: {
              id: {
                in: selectedIds
              }
            },
            data: {
              checkoutId: userCheckoutId.checkout?.id
            }
          })
    
          return res.status(200).send({status: 'ok', msg: 'selectedIds updated'})
        } catch (error) {
          return res.status(400).send({status: 'error', msg: error})
        }
      }
}