import { Request, Response } from 'express';
import prisma from '@/prisma';
import { sign, verify } from 'jsonwebtoken';
import { transporter } from '@/helpers/nodemailer';
import { compare, genSalt, hash } from 'bcrypt';
import { generateReferralCode } from '@/helpers/referral';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';

export class UserController {
  async getUsers(req: Request, res: Response) {
    try {
      const requesterRole = req.user?.role;
      if (requesterRole !== 'SUPER_ADMIN') {
        return res.status(403).send({
          status: 'error',
          msg: 'Unauthorized access',
        });
      }

      const users = await prisma.user.findMany({
        where: {
          role: {
            notIn: ['SUPER_ADMIN', 'STORE_ADMIN'],
          },
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

  async getUserById(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    return res.status(200).send(user);
  }

  async registerUser(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });
      if (existingUser) throw 'Email sudah digunakan';

      await prisma.user.create({
        data: {
          email,
          name: '',
          password: '',
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
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async verifyUser(req: Request, res: Response) {
    try {
      const { password, name } = req.body;
      const { token } = req.params;
      const referralCode = generateReferralCode(name);
      const decoded = verify(token, process.env.SECRET_JWT!) as {
        email: string;
      };
      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      const user = await prisma.user.findUnique({
        where: { email: decoded.email },
      });
      if (user?.isVerified) throw 'Invalid Link: User already verified';

      await prisma.user.update({
        where: { email: decoded.email },
        data: {
          isVerified: true,
          password: hashPassword,
          name: name,
          referralCode: referralCode,
        },
      });

      res.status(201).send({
        status: 'ok',
        msg: 'akun berhasil dibuat, silahkan login',
        user,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const existingUser = await prisma.user.findUnique({
        where: { email: email },
        include: {
          cart: {
            select: {
              CartItem: { include: { product: { include: { stock: true } } } },
            },
          },
          address: true,
        },
      });
      if (!existingUser) throw 'Akun tidak ditemukan';
      if (!existingUser.isVerified) throw 'author not verify !';

      if (!existingUser.password)
        throw 'Akun ini menggunakan login Google. Silakan login dengan Google.';

      const isValidPass = await compare(password, existingUser.password);

      if (!isValidPass) throw 'password salah';

      const payload = { id: existingUser.id, role: existingUser.role };
      const token = sign(payload, process.env.SECRET_JWT!, { expiresIn: '2w' });

      res.status(200).send({
        status: 'ok',
        msg: 'Berhasil masuk',
        token,
        cart: existingUser.cart,
        user: {
          id: existingUser.id,
          role: existingUser.role,
          name: existingUser.name,
          email: existingUser.email,
          avatarUrl: existingUser.avatarUrl,
          address: existingUser.address,
        },
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  //for testing
  async createUsersDummy(req: Request, res: Response) {
    const user = await prisma.user.create({
      data: {
        name: 'Dummy',
        email: 'Dummy',
        password: 'asdasdasd',
        role: 'USER',

        //create empty checkout
        checkout: {
          create: {},
        },

        //create empty cart
        cart: {
          create: {},
        },
      },
    });

    return res.status(201).send({ status: 'ok', msg: user });
  }

  async getUserAddressess(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const userAddressess = await prisma.user.findUnique({
        select: {
          address: true,
        },
        where: { id: +userId },
      });

      return res
        .status(200)
        .send({ status: 'ok', data: userAddressess?.address });
    } catch (error) {
      return res.status(400).send({ status: 'error', msg: error });
    }
  }

  async editAvatar(req: Request, res: Response) {
    try {
      if (!req.file) throw 'no file uploaded';
      const link = `${process.env.BASE_URL_BE}public/avatar/${req.file?.filename}`;
      console.log(link);
      await prisma.user.update({
        data: { avatarUrl: link },
        where: { id: req.user?.id },
      });
      console.log(req.file);
      res.status(200).send({
        status: 'ok',
        msg: 'edit avatar success!',
        avatarUrl: link,
      });
    } catch (err) {
      return res.status(400).send({ status: 'error', msg: err });
    }
  }
}
