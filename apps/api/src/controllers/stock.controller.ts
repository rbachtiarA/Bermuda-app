import prisma from '@/prisma';
import { Request, Response } from 'express';

export class StockController {
  async createStock(req: Request, res: Response) {
    try {
      const { storeId, productId, quantity } = req.body;

      if (!storeId || !productId || !quantity) {
        return res.status(400).send({ message: 'Missing required fields' });
      }

      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid quantity' });
      }

      const newStock = await prisma.stock.create({
        data: {
          storeId: Number(storeId),
          productId: Number(productId),
          quantity: Number(quantity),
        },
      });

      res.status(201).json({
        message: 'Stock created successfully',
        data: newStock,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        msg: 'An error occurred while creating stock',
      });
    }
  }

  async getStocks(req: Request, res: Response) {
    try {
      const { storeId, productId } = req.query;

      const filters: any = {};
      if (storeId) {
        filters.storeId = Number(storeId);
      }
      if (productId) {
        filters.productId = Number(productId);
      }

      const stocks = await prisma.stock.findMany({
        where: filters,
        include: {
          store: true,
          product: true,
        },
      });

      res.status(200).json({
        message: 'Stocks retrieved successfully',
        data: stocks,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        msg: 'An error occurred while fetching stocks',
      });
    }
  }

  async getStockById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        return res.status(400).send({
          status: 'error',
          msg: 'Invalid ID format',
        });
      }

      const stock = await prisma.stock.findUnique({
        where: { id },
        select: {
          product: true,
          store: true,
          quantity: true,
          stockHistory: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      if (!stock) {
        return res.status(404).json({
          status: 'error',
          msg: 'Stock not found',
        });
      }

      res.status(200).json({
        message: 'Stock retrieved successfully',
        data: stock,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        msg: 'An error occurred while fetching stock details',
      });
    }
  }

  async updateStock(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantity, storeId, productId } = req.body;

      if (!id) {
        return res.status(400).json({
          status: 'error',
          msg: 'Stock ID is required',
        });
      }

      if (!quantity && !storeId && !productId) {
        return res.status(400).json({
          status: 'error',
          msg: 'At least one field (quantity, storeId, productId) is required for update',
        });
      }

      const existingStock = await prisma.stock.findUnique({
        where: { id: Number(id) },
      });
      if (!existingStock)
        return res.status(404).json({ message: 'Stock not found' });

      const changeType =
        quantity > existingStock.quantity ? 'INCREASE' : 'DECREASE';
      await prisma.stockHistory.create({
        data: {
          stockId: existingStock.id,
          changeType,
          quantity: Math.abs(quantity - existingStock.quantity),
        },
      });

      const updatedStock = await prisma.stock.update({
        where: { id: Number(id) },
        data: {
          ...(quantity !== undefined ? { quantity: Number(quantity) } : {}),
          ...(storeId !== undefined ? { storeId: Number(storeId) } : {}),
          ...(productId !== undefined ? { productId: Number(productId) } : {}),
        },
      });

      res
        .status(200)
        .json({ message: 'Stock updated successfully', data: updatedStock });
    } catch (error) {
      res.status(500).json({ message: 'Error updating stock', error });
    }
  }

  async deleteStock(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        return res.status(400).json({
          status: 'error',
          msg: 'Invalid Stock ID.',
        });
      }

      const stock = await prisma.stock.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!stock) {
        return res.status(404).json({
          status: 'error',
          msg: 'Stock not found.',
        });
      }

      await prisma.stock.delete({
        where: { id },
      });

      return res.status(200).json({
        status: 'ok',
        msg: `Stock "${stock.id}" successfully deleted.`,
      });
    } catch (error) {
      console.error('Error deleting stock:', error);
      return res.status(500).json({
        status: 'error',
        msg: 'An error occurred while deleting the stock.',
      });
    }
  }

  async getStockHistory(req: Request, res: Response) {
    try {
      const { stockId } = req.params;

      if (!stockId) {
        return res.status(400).send({
          status: 'error',
          msg: 'Stock ID is required',
        });
      }

      const stockHistory = await prisma.stockHistory.findMany({
        where: { stockId: Number(stockId) },
        orderBy: { createdAt: 'desc' },
      });

      if (stockHistory.length === 0) {
        return res.status(404).send({
          message: 'No stock history found for the provided Stock ID',
        });
      }

      return res.status(200).send({
        message: 'Stock history retrieved successfully',
        data: stockHistory,
      });
    } catch (error) {
      return res.status(500).send({
        status: 'error',
        msg: 'Error retrieving stock history',
      });
    }
  }
}
