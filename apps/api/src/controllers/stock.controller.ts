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
        include: {
          product: true
        },
        data: {
          storeId: Number(storeId),
          productId: Number(productId),
          quantity: Number(quantity),
        },
      });

      await prisma.stockHistory.create({
        data: {
          stockId: newStock.id,
          changeType: 'INCREASE',
          quantity: Math.abs(quantity - newStock.quantity),
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
        select: { id: true, isDeleted: true, quantity: true },
      });

      if (!stock) {
        return res.status(404).json({
          status: 'error',
          msg: 'Stock not found.',
        });
      }

      if (stock.isDeleted) {
        return res.status(400).json({
          status: 'error',
          msg: 'Stock already marked as deleted.',
        });
      }

      await prisma.stock.update({
        where: { id },
        data: { isDeleted: true },
      });

      await prisma.stockHistory.create({
        data: {
          stockId: stock.id,
          changeType: 'DELETED',
          quantity: 0,
        },
      });

      return res.status(200).json({
        status: 'ok',
        msg: `Stock "${stock.id}" successfully marked as deleted.`,
      });
    } catch (error) {
      console.error('Error deleting stock:', error);
      return res.status(500).json({
        status: 'error',
        msg: 'An error occurred while marking the stock as deleted.',
      });
    }
  }

  async getReportSales(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      let stockHistory: any[] = [];

      if (!userId) {
        return res.status(400).send({
          status: 'error',
          msg: 'User ID is required',
        });
      }

      if (userId) {
        const user = await prisma.user.findUnique({
          where: {
            id: +userId,
          },
        });

        if (user?.role === 'SUPER_ADMIN') {
          stockHistory = await prisma.stockHistory.findMany({
            include: {
              stock: {
                include: {
                  product: true,
                  store: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          });
        } else {
          stockHistory = await prisma.stockHistory.findMany({
            where: {
              stock: {
                storeId: Number(user?.storeId),
              },
            },
            include: {
              stock: {
                include: {
                  product: true,
                  store: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
        }

        if (stockHistory.length === 0) {
          return res.status(404).send({
            message: 'No stock history found for the provided criteria',
          });
        }
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
