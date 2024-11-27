import prisma from '@/prisma';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { transporter } from '@/helpers/nodemailer';
import { genSalt, hash } from 'bcrypt';

export class StoreAdminController {
  async createStoreAdmin(req: Request, res: Response) {
    const { email } = req.body;
    const existhingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existhingUser) throw 'Email sudah digunakan';

    await prisma.user.create({
      data: {
        email,
        name: '',
        password: '',
        role: 'STORE_ADMIN',
        isVerified: false,
        referralCode: null,
      },
    });

    const payload = { email };
    const token = sign(payload, process.env.SECRET_JWT!, { expiresIn: '1h' });

    const templatePath = path.join(
      __dirname,
      '../templates',
      'verification.hbs',
    );
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(templateSource);
    const html = compiledTemplate({
      link: `${process.env.BASE_URL_FE}verify/${token}`,
    });

    await transporter.sendMail({
      to: email,
      subject: 'Selamat Datang di Bermuda Store',
      html: html,
    });

    res.status(201).send({
      status: 'ok',
      message: 'Email verifikasi terkirim, silahkan cek email anda',
    });
    try {
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async getStoreAdmin(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        where: {
          role: {
            notIn: ['SUPER_ADMIN', 'USER'],
          },
        },
        include: {
          store: true,
          address: true,
          cart: true,
        },
      });

      res.status(200).send({
        status: 'ok',
        users,
      });
    } catch (err) {
      res.status(500).send({
        status: 'error',
        msg: 'Internal server error',
      });
    }
  }

  async getStoreAdminById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        return res.status(400).send({
          status: 'error',
          msg: 'Invalid Store Admin ID!',
        });
      }

      const storeAdmin = await prisma.user.findUnique({
        where: { id },
      });

      if (!storeAdmin) {
        return res.status(404).send({
          status: 'error',
          msg: 'Store Admin not found!',
        });
      }

      res.status(200).send({
        status: 'ok',
        storeAdmin,
      });
    } catch (err) {
      console.error(err);

      res.status(500).send({
        status: 'error',
        msg: err instanceof Error ? err.message : 'Server error',
      });
    }
  }

  async deleteStoreAdmin(req: Request, res: Response) {
    try {
      const requesterRole = req.user?.role;
      if (requesterRole !== 'SUPER_ADMIN') {
        return res.status(403).send({
          status: 'error',
          msg: 'Unauthorized access',
        });
      }

      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        return res.status(400).send({
          status: 'error',
          msg: 'Invalid ID format',
        });
      }

      const storeAdmin = await prisma.user.findUnique({
        where: { id },
        select: { role: true, checkout: true, cart: true },
      });

      if (!storeAdmin || storeAdmin.role !== 'STORE_ADMIN') {
        return res.status(404).send({
          status: 'error',
          msg: 'Store Admin not found',
        });
      }

      if (storeAdmin.cart && storeAdmin.checkout) {
        await prisma.cart.delete({
          where: { id: storeAdmin.cart?.id },
        });

        await prisma.checkout.delete({
          where: { id: storeAdmin.checkout?.id },
        });
      }

      await prisma.user.delete({
        where: { id },
      });

      res.status(200).send({
        status: 'ok',
        msg: 'Store Admin deleted successfully',
      });
    } catch (err) {
      res.status(500).send({
        status: 'error',
        msg: 'Internal server error',
      });
    }
  }

  async updateStoreAdmin(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).send({
          status: 'error',
          msg: 'Invalid ID format',
        });
      }
      const { email, name, password } = req.body;

      // Periksa apakah user dengan ID tersebut ada
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });
      if (!existingUser) {
        return res.status(404).send({
          status: 'error',
          message: 'Store admin tidak ditemukan',
        });
      }

      // Periksa apakah email sudah digunakan oleh user lain
      if (email && email !== existingUser.email) {
        const emailInUse = await prisma.user.findUnique({
          where: { email },
        });
        if (emailInUse) {
          return res.status(400).send({
            status: 'error',
            message: 'Email sudah digunakan oleh user lain',
          });
        }
      }

      const salt = await genSalt(10);
      const hasPassword = await hash(password, salt);

      // Update data store admin
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          email: email || existingUser.email,
          name: name || existingUser.name,
          password: hasPassword,
        },
      });

      res.status(200).send({
        status: 'ok',
        message: 'Store admin berhasil diperbarui',
        data: updatedUser,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        message: err,
      });
    }
  }
}
