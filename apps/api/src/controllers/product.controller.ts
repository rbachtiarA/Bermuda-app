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

  async getSampleDataById(req: Request, res: Response) {
    const { id } = req.params;

    const sample = await prisma.sample.findUnique({
      where: { id: Number(id) },
    });

    if (!sample) {
      return res.send(404);
    }

    return res.status(200).send(sample);
  }

  async createSampleData(req: Request, res: Response) {
    const { name, code } = req.body;

    const newSampleData = await prisma.sample.create({
      data: { name, code },
    });

    return res.status(201).send(newSampleData);
  }
}

console.log('Hello')
