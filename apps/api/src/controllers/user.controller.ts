import { Request, Response } from 'express';
import prisma from '@/prisma';
import { sign, verify } from 'jsonwebtoken';
import { transporter } from '@/helpers/nodemailer';
import { compare, genSalt, hash } from 'bcrypt';
import { generateReferralCode } from '@/helpers/referral';

export class UserController {
  async getUsers(req: Request, res: Response) {
    const usersData = await prisma.user.findMany();

    return res.status(200).send(usersData);
  }
}
