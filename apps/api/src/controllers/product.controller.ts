import { Request, Response } from 'express';
import prisma from '@/prisma';
import { Prisma } from '@prisma/client';

export class ProductController {
  async getProducts(req: Request, res: Response) {
    const productData = await prisma.product.findMany({
      include: {
        stores: true,
      },
    });

    return res.status(200).send({
      status: 'ok',
      data: productData,
    });
  }

  /// Temporary from Dwi
  async ProdutSearch(req: Request, res: Response) {
    try {
      const { search } = req.query;
      
      let filter: Prisma.ProductWhereInput = {};
      if (search) {
        filter.name = {
          contains: search as string,
          // mode: 'insensitive', opsional
        };
      }

      const products = await prisma.product.findMany({
        where: filter,
        include: {
          // categories: true,
          // discounts: true,
          stock: true,
        },
      });
      res.status(200).send({
        status: 'ok',
        products,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }
}
