import { Request, Response } from 'express';
import prisma from '@/prisma';
import { Prisma } from '@prisma/client';

export class ProductController {
  async getProducts(req: Request, res: Response) {
    try {
      const { search, page = 1, pageSize = 10, categories } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const pageSizeNumber = parseInt(pageSize as string, 10);

      // Validasi page dan pageSize
      if (isNaN(pageNumber) || pageNumber <= 0) {
        return res.status(400).send({
          status: 'error',
          msg: 'Invalid page number',
        });
      }
      if (isNaN(pageSizeNumber) || pageSizeNumber <= 0) {
        return res.status(400).send({
          status: 'error',
          msg: 'Invalid page size',
        });
      }

      // Membuat filter untuk query
      let filter: Prisma.ProductWhereInput = {};
      if (search) {
        filter.name = { contains: search as string }; // mode insensitive untuk pencarian tanpa case-sensitive
      }
      if (categories && categories !== 'all') {
        filter.categories = {
          some: { name: categories as string }, // Menggunakan relasi kategori
        };
      }

      // Query database untuk data produk dan totalnya
      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          where: filter,
          orderBy: { createdAt: 'desc' },
          include: { categories: true }, // Menyertakan data kategori
          skip: (pageNumber - 1) * pageSizeNumber,
          take: pageSizeNumber,
        }),
        prisma.product.count({ where: filter }),
      ]);

      // Mengirimkan response
      res.status(200).send({
        status: 'ok',
        products,
        pagination: {
          currentPage: pageNumber,
          pageSize: pageSizeNumber,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / pageSizeNumber),
        },
      });
    } catch (err) {
      res.status(500).send({
        status: 'error',
        msg: 'An error occurred',
        error: err,
      });
    }
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

  async createOrUpdateProduct(req: Request, res: Response) {
    try {
      if (!req?.file) throw 'no file uploaded';

      const link = `http://localhost:8000/api/public/product/${req?.file?.filename}`;

      const {
        id, // Get the id from the body if available
        name,
        description,
        price,
        slug,
        isRecommended = false,
        categories,
        // stores, // Uncomment if you plan to use stores later
      } = JSON.parse(req.body.data);
      console.log(JSON.parse(req.body.data));

      let product;

      if (id) {
        // If the product id exists, update the product
        product = await prisma.product.update({
          where: { id: Number(id) },
          data: {
            name,
            description,
            price: Number(price),
            imageUrl: link,
            slug,
            isRecommended,
            categories: {
              set: [], // Clear existing categories if you're updating the categories
              connect: categories.map((categoryId: number) => ({
                id: Number(categoryId),
              })),
            },
            // stores: {
            //   set: [], // Clear existing stores if you're updating the stores
            //   connect: stores.map((storeId: number) => ({ id: storeId })),
            // },
          },
        });
      } else {
        // If no id exists, create a new product
        product = await prisma.product.create({
          data: {
            name,
            description,
            price: Number(price),
            imageUrl: link,
            slug,
            isRecommended,
            categories: {
              connect: categories.map((categoryId: number) => ({
                id: Number(categoryId),
              })),
            },
            // stores: {
            //   connect: stores.map((storeId: number) => ({ id: storeId })),
            // },
          },
        });
      }

      res.status(201).send({
        status: 'ok',
        msg: id ? 'Product updated!' : 'Product created!',
        product,
      });
    } catch (err) {
      console.log(err);

      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async getProductSlug(req: Request, res: Response) {
    try {
      const events = await prisma.product.findFirst({
        where: { slug: req.params.slug },
      });
      res.status(200).send({
        status: 'ok',
        events,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }
}
