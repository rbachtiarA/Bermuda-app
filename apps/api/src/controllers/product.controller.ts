import { Request, Response } from 'express';
import prisma from '@/prisma';


export class ProductController {
  async getProducts(req: Request, res: Response) {
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
