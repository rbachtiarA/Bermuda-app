import { Request, Response } from 'express';
import prisma from '@/prisma';
import { rajaonkir } from '@/templates/rajaonkir';

export class AddressController {
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

  async getCities(req: Request, res: Response) {
    try {
      const search = req.query.search as string;

      const cities = await prisma.city.findMany({
        where: search ? { name: { contains: search } } : undefined,
        select: { id: true, name: true },
      });

      res.status(200).json(cities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cities' });
    }
  }

  async createAddress(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ message: 'Unauthorized: User ID is missing.' });
      }

      const {
        label,
        recipient,
        phoneNumber,
        addressLine,
        cityId,
        state,
        postalCode,
        latitude,
        longitude,
        isPrimary,
      } = req.body;

      if (isPrimary) {
        const primaryExists = await prisma.address.findFirst({
          where: { userId, isPrimary: true },
        });

        if (primaryExists) {
          await prisma.address.updateMany({
            where: {
              userId,
              isPrimary: true,
            },
            data: {
              isPrimary: false,
            },
          });
        }
      }
      const newAddress = await prisma.address.create({
        data: {
          userId,
          label,
          recipient,
          phoneNumber,
          addressLine,
          cityId,
          state,
          postalCode,
          latitude,
          longitude,
          isPrimary,
        },
      });

      return res.status(201).json({
        status: 'ok',
        message: 'Alamat berhasil disimpan',
        data: newAddress,
      });
    } catch (error) {
      console.error('Error creating address', error);
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat menyimpan alamat',
      });
    }
  }
}