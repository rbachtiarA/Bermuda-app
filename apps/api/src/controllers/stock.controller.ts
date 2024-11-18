import prisma from '@/prisma';
import { Request, Response } from 'express';

export class StockController {
  // Create a new stock entry (without price)
  async createStock(req: Request, res: Response) {
    try {
      const { storeId, productId, quantity } = req.body;
      console.log(req.body, './.>?>?>');

      // Validate required fields
      if (!storeId || !productId || !quantity) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Ensure quantity is a valid number
      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid quantity' });
      }

      // Create a new stock record without the price field
      const newStock = await prisma.stock.create({
        data: {
          storeId: Number(storeId),
          productId: Number(productId),
          quantity: Number(quantity),
        },
      });

      // Return the newly created stock entry
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

      // Build query filters dynamically based on the provided parameters
      const filters: any = {};
      if (storeId) {
        filters.storeId = Number(storeId);
      }
      if (productId) {
        filters.productId = Number(productId);
      }

      // Fetch stocks from the database with optional filters
      const stocks = await prisma.stock.findMany({
        where: filters,
        include: {
          store: true, // Optionally include related store details
          product: true, // Optionally include related product details
        },
      });

      // Return the list of stocks
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
        select: { product: true, store: true, quantity: true },
      });

      // If stock is not found, return a 404 response
      if (!stock) {
        return res.status(404).json({
          status: 'error',
          msg: 'Stock not found',
        });
      }

      // Return the stock details
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
      const { id } = req.params; // ID stock yang akan diupdate
      const { quantity, storeId, productId } = req.body; // Data yang ingin diperbarui

      // Validasi input
      if (!id) {
        return res.status(400).json({
          status: 'error',
          msg: 'Stock ID is required',
        });
      }

      // Pastikan data yang dikirim valid
      if (!quantity && !storeId && !productId) {
        return res.status(400).json({
          status: 'error',
          msg: 'At least one field (quantity, storeId, productId) is required for update',
        });
      }

      // Cari stock berdasarkan ID
      const existingStock = await prisma.stock.findUnique({
        where: { id: Number(id) },
      });

      if (!existingStock) {
        return res.status(404).json({
          status: 'error',
          msg: 'Stock not found',
        });
      }

      // Lakukan update data
      const updatedStock = await prisma.stock.update({
        where: { id: Number(id) },
        data: {
          ...(quantity !== undefined ? { quantity: Number(quantity) } : {}),
          ...(storeId !== undefined ? { storeId: Number(storeId) } : {}),
          ...(productId !== undefined ? { productId: Number(productId) } : {}),
        },
      });

      // Kembalikan response sukses
      res.status(200).json({
        message: 'Stock updated successfully',
        data: updatedStock,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        msg: 'An error occurred while updating the stock',
      });
    }
  }

  async deleteStock(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);

      // Validate the ID parameter
      if (isNaN(id)) {
        return res.status(400).json({
          status: 'error',
          msg: 'Invalid Stock ID.',
        });
      }

      // Check if the stock exists
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

      // Delete the stock record
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
}
