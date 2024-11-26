import { Request, Response } from 'express';
import prisma from '@/prisma';
import path from 'path';
import { rajaonkir } from '@/templates/rajaonkir';

export class DiscountController {
  async getAvailableDiscountOnCheckout(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { storeId } = req.params;
      const checkoutItems = await prisma.checkout.findFirst({
        where: {
          userId: +userId!,
        },
        select: {
          CartItem: {
            select: {
              product: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      const productIds = checkoutItems?.CartItem.map((item) => item.product.id);
      const discount = await prisma.discount.findMany({
        where: {
          OR: [
            {
              AND: {
                storeId: +storeId,
                productId: null,
                userId: null,
              },
            },
            {
              AND: {
                productId: {
                  in: productIds,
                },
                storeId: +storeId,
              },
            },
          ],
        },include: {products: true},
      });

      if (!checkoutItems) throw 'Something wrong when check your cart';
      return res.status(200).send({
        status: 'ok',
        discount,
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        msg: error,
      });
    }
  }

  async getDiscount(req: Request, res: Response) {
    const { storeId, productId, discountType } = req.query;

    try {
      const filters: any = {};

      if (storeId) {
        filters.storeId = Number(storeId);
      }
      if (productId) {
        filters.productId = Number(productId);
      }
      if (discountType) {
        filters.discountType = discountType;
      }

      const discounts = await prisma.discount.findMany({
        where: filters,
        include: {
          products: true,
          stores: true,
        },
      });

      if (discounts.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Diskon tidak ditemukan',
        });
      }

      return res.status(200).json({
        status: 'ok',
        message: 'Diskon berhasil diambil',
        discounts,
      });
    } catch (error) {
      console.error('Error fetching discounts:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil diskon',
      });
    }
  }

  async updateProvince(req: Request, res: Response) {
    const { results } = rajaonkir;
    const provinces = results.map((item) => {
      return { id: Number(item.province_id), name: item.province };
    });
    const cities = results.map((item) => {
      return {
        id: Number(item.city_id),
        provinceId: Number(item.province_id),
        name: `${item.type === 'Kota' ? 'Kota ' : ' '}${item.city_name}`,
      };
    });

    const setProvince = new Set([...provinces]);
    await prisma.province.createMany({
      data: provinces,
      skipDuplicates: true,
    });
    await prisma.city.createMany({
      data: cities,
      skipDuplicates: true,
    });
    return res.status(200).send({
      msg: 'Success update city and province',
    });
  }

  async createManualDiscount(req: Request, res: Response) {
    const { productId, value, discountType, storeId } = req.body;

    try {
      const discount = await prisma.discount.create({
        data: {
          discountType,
          value,
          productId,
          storeId,
        },
      });

      res
        .status(201)
        .json({ message: 'Diskon manual berhasil dibuat', discount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Gagal membuat diskon manual' });
    }
  }

  async createConditionalDiscount(req: Request, res: Response) {
    const { minPurchase, value, discountType, storeId } = req.body;

    try {
      const discount = await prisma.discount.create({
        data: {
          discountType,
          value,
          minPurchase,
          storeId,
        },
      });

      res
        .status(201)
        .json({ message: 'Diskon bersyarat berhasil dibuat', discount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Gagal membuat diskon bersyarat' });
    }
  }

  async createBuyOneGetOneDiscount(req: Request, res: Response) {
    const { productId, storeId } = req.body;

    if (!productId || !storeId) {
      return res
        .status(400)
        .json({ error: 'Product ID dan Store ID diperlukan' });
    }

    try {
      const discount = await prisma.discount.create({
        data: {
          discountType: 'BUY_ONE_GET_ONE',
          value: 1,
          productId,
          storeId,
        },
      });

      res.status(201).json({
        message: 'Diskon beli satu gratis satu berhasil dibuat',
        discount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Gagal membuat diskon BOGO' });
    }
  }
}
