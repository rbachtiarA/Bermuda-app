import { Request, Response } from 'express';
import prisma from '@/prisma';
import { sign, verify } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { transporter } from '@/helpers/nodemailer';
import handlebars from 'handlebars';
import { genSalt, hash } from 'bcrypt';

export class AccountUtilsController {
  async resetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });
      if (!existingUser) throw 'Email tidak ditemukan';
      if (!existingUser.isVerified) {
        throw 'Akun ini belum diverifikasi. Silakan verifikasi terlebih dahulu.';
      }
      if (!existingUser.password) {
        throw 'Akun ini menggunakan login sosial, reset password tidak berlaku.';
      }

      const payload = { email };
      const token = sign(payload, process.env.SECRET_JWT!, { expiresIn: '1h' });

      const templatePath = path.join(
        __dirname,
        '../templates',
        'resetPassword.hbs',
      );
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({
        link: `${process.env.BASE_URL_FE}reset-password/new-password/${token}`,
      });

      await transporter.sendMail({
        to: email,
        subject: 'Verifikasi Reset Password',
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

  async newPassword(req: Request, res: Response) {
    try {
      const { password } = req.body;
      const { token } = req.params;
      const decoded = verify(token, process.env.SECRET_JWT!) as {
        email: string;
      };
      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      const user = await prisma.user.findUnique({
        where: { email: decoded.email },
      });

      await prisma.user.update({
        where: { email: decoded.email },
        data: {
          password: hashPassword,
        },
      });

      res.status(201).send({
        status: 'ok',
        msg: 'password berhasil di reset, silahkan login',
        user,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }
}
