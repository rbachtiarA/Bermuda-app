import prisma from '@/prisma';
import { Request, Response } from 'express';

export class CategoryController {
  async getCategory(req: Request, res: Response) {
    try {
      const allCategory = await prisma.productCategory.findMany();

      res.status(200).send({
        status: 'ok',
        allCategory,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }
}
