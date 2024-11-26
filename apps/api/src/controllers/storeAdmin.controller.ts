import prisma from '@/prisma';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { transporter } from '@/helpers/nodemailer';
import { hash } from 'bcrypt';

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
        select: { role: true },
      });

      if (!storeAdmin || storeAdmin.role !== 'STORE_ADMIN') {
        return res.status(404).send({
          status: 'error',
          msg: 'Store Admin not found',
        });
      }

      const { email, name, password } = req.body;

      // Validasi input
      if (!email && !name && !password) {
        return res.status(400).send({
          status: 'error',
          msg: 'No data provided for update',
        });
      }

      const updateData: any = {};
      if (email) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser && existingUser.id !== id) {
          return res.status(400).send({
            status: 'error',
            msg: 'Email already in use',
          });
        }
        updateData.email = email;
      }
      if (name) {
        updateData.name = name;
      }
      if (password) {
        // Hash the password
        const hashedPassword = await hash(password, 10);
        updateData.password = hashedPassword;
      }

      await prisma.user.update({
        where: { id },
        data: updateData,
      });

      res.status(200).send({
        status: 'ok',
        msg: 'Store Admin updated successfully',
      });
    } catch (err) {
      res.status(500).send({
        status: 'error',
        msg: 'Internal server error',
      });
    }
  }
}
