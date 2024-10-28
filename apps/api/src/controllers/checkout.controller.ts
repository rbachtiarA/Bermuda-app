import { Request, Response } from 'express';
import prisma from '@/prisma';

//not needed yet
export class CheckoutController {
  async updateCheckoutItem(req: Request, res: Response) {
    try {
      const { userId } = req.body
      
      
    } catch (error) {
      
    }
    
    const productData = await prisma.product.findMany({
      include: {
        stores: true
      }
    });

    return res.status(200).send({
      status: 'ok',
      data: productData
    });
  }
}
