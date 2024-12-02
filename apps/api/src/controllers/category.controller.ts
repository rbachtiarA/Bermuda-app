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

  async createCategory(req: Request, res: Response) {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .send({ status: 'error', msg: 'Category name is required' });
    }

    try {
      const existingCategory = await prisma.productCategory.findUnique({
        where: { name },
      });

      if (existingCategory) {
        return res.status(400).send({
          status: 'error',
          msg: 'A category with this name already exists',
        });
      }

      const newCategory = await prisma.productCategory.create({
        data: { name },
      });

      res.status(201).send({
        status: 'ok',
        msg: 'Successfully created user',
        category: newCategory,
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        msg: 'Internal server error',
      });
    }
  }

  async updateCategory(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    try {
      const existingCategory = await prisma.productCategory.findUnique({
        where: { name },
      });

      if (existingCategory && existingCategory.id !== parseInt(id)) {
        return res
          .status(400)
          .json({ error: 'A category with this name already exists' });
      }

      const updatedCategory = await prisma.productCategory.update({
        where: { id: parseInt(id) },
        data: { name },
      });

      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product category' });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        return res.status(400).send({
          status: 'error',
          msg: 'Product Category is required.',
        });
      }

      const productCategory = await prisma.productCategory.findUnique({
        where: { id },
        select: { name: true },
      });

      if (!productCategory) {
        return res.status(404).send({
          status: 'error',
          msg: 'Product Category not found.',
        });
      }

      await prisma.productCategory.delete({
        where: { id },
      });

      return res.status(200).send({
        status: 'ok',
        msg: 'Product Category successfully deleted.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        status: 'error',
        msg: 'An error occurred while deleting the product category.',
      });
    }
  }
}
