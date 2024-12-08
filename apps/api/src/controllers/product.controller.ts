import { Request, Response } from 'express';
import prisma from '@/prisma';
import { Prisma } from '@prisma/client';
import { cloudinaryUpload } from '@/middleware/cloudinary';

export class ProductController {
  async getProducts(req: Request, res: Response) {
    try {
      const { search, page = 1, pageSize = 10, categories } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const pageSizeNumber = parseInt(pageSize as string, 10);

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

      let filter: Prisma.ProductWhereInput = {};
      if (search) {
        filter.name = { contains: search as string, mode: 'insensitive' };
      }
      if (categories && categories !== 'all') {
        filter.categories = {
          some: { name: categories as string },
        };
      }

      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          where: filter,
          orderBy: { createdAt: 'desc' },
          include: { categories: true, stores: true },
          skip: (pageNumber - 1) * pageSizeNumber,
          take: pageSizeNumber,
        }),
        prisma.product.count({ where: filter }),
      ]);

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

  async getProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        return res.status(400).send({
          status: 'error',
          msg: 'Invalid product ID!',
        });
      }

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          categories: true,
          discounts: true,
          stock: {
            include: {
              stockHistory: {
                orderBy: {
                  createdAt: 'desc',
                },
              },
            },
          },
        },
      });

      if (!product) {
        return res.status(404).send({
          status: 'error',
          msg: 'Product not found!',
        });
      }

      res.status(200).send({
        status: 'ok',
        product,
      });
    } catch (err) {
      console.error(err);

      res.status(500).send({
        status: 'error',
        msg: err instanceof Error ? err.message : 'Server error',
      });
    }
  }

  async ProdutSearch(req: Request, res: Response) {
    try {
      const { search } = req.query;

      let filter: Prisma.ProductWhereInput = {};
      if (search) {
        filter.name = {
          contains: search as string,
        };
      }

      const products = await prisma.product.findMany({
        where: filter,
        include: {
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

  async createProduct(req: Request, res: Response) {
    try {
      if (!req.file) throw new Error('No file uploaded');

      // const link = `${process.env.BASE_URL_BE}public/product/${req.file.filename}`;
      const { secure_url } = await cloudinaryUpload(req.file, 'product')
      const link = secure_url;

      const {
        name,
        description,
        price,
        slug,
        isRecommended = false,
        categories,
      } = JSON.parse(req.body.data);

      const existingProduct = await prisma.product.findUnique({
        where: {
          name,
        },
      });

      if (existingProduct) {
        return res.status(400).send({
          status: 'error',
          msg: 'A product with this name already exists.',
        });
      }

      const product = await prisma.product.create({
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
        },
      });

      res.status(201).send({
        status: 'ok',
        msg: 'Product created!',
        product,
      });
    } catch (err) {
      console.log(err);

      res.status(400).send({
        status: 'error',
        msg: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const {
        id,
        name,
        description,
        price,
        slug,
        isRecommended = false,
        categories,
        imageUrl,
      } = JSON.parse(req.body.data);

      console.log(req?.file, 'INI FILEEE');

      let link: string = '';
      if (req?.file) {
        const { secure_url } = await cloudinaryUpload(req.file, 'product')
        link = secure_url;
        // link = `${process.env.BASE_URL_BE}public/product/${req?.file?.filename}`;
      } else {
        link = imageUrl;
      }
      const existingProduct = await prisma.product.findUnique({
        where: { id: Number(id) },
      });

      if (!existingProduct) {
        return res.status(404).send({
          status: 'error',
          msg: 'Product not found!',
        });
      }

      const product = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          name,
          description,
          price: Number(price),
          imageUrl: link,
          slug,
          isRecommended,
          categories: {
            set: [],
            connect: categories.map((categoryId: number) => ({
              id: Number(categoryId),
            })),
          },
        },
      });

      res.status(200).send({
        status: 'ok',
        msg: 'Product updated!',
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

  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) {
        return res.status(400).send({
          status: 'error',
          msg: 'Invalid product ID',
        });
      }
      const deletedProduct = await prisma.product.delete({
        where: {
          id: Number(id),
        },
      });

      if (!deletedProduct) {
        return res.status(404).send({
          status: 'error',
          msg: 'Product not found',
        });
      }

      res.status(200).send({
        status: 'ok',
        msg: 'Product deleted successfully',
        deletedProduct,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: 'error',
        msg: 'An error occurred while deleting the product',
        error: err,
      });
    }
  }
}
