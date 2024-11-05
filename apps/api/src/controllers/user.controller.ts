import { Request, Response } from 'express';
import prisma from '@/prisma';
import { sign, verify } from 'jsonwebtoken';
import { transporter } from '@/helpers/nodemailer';
import { compare, genSalt, hash } from 'bcrypt';
import { generateReferralCode } from '@/helpers/referral';
import path from 'path';
import fs from 'fs'
import handlebars from 'handlebars';

export class UserController {
  async getUsers(req: Request, res: Response) {
    const usersData = await prisma.user.findMany();

<<<<<<<<< Temporary merge branch 1
    return res.status(200).send(usersData);
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
        Checkout: {
          create: {}
        },

        //create empty cart
        cart: { 
          create: {}
        }
      }
    })

    return res.status(201).send({status: 'ok', msg: user})
  }

  async getUserAddressess(req: Request, res: Response) {
    try {
      
      //remove this after cookies implemented
      const {userId} = req.params
      
      //isUserExist
      const userAddressess = await prisma.user.findUnique({
        select: {
            Address: true
        },
        where: { id: +userId }
      })
      
      return res.status(200).send({status: 'ok', data: userAddressess?.Address})
    } catch (error) {
      return res.status(400).send({status: 'error', msg: error})
=========
    res.status(200).send({
      status: 'ok',
      usersData
    }); 
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      })
    }
  }

  async getUserById(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    return res.status(200).send(user)
  }

  async registerUser(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });
      if (existingUser) throw 'Email sudah digunakan';

      const verificationToken = sign({ email }, process.env.SECRET_JWT!, { expiresIn: '1h'});
      await prisma.user.create({
        data: {
          email,
          name: "",
          password: "",
          verificationToken,
          isVerified: false,
          referralCode: ""
        }
      });

      await transporter.sendMail({
        to: email,
        subject: 'Email Verifikasi',
        text: `Klik link ini untuk verifikasi akun: ${process.env.BASE_URL}/verify?token=${verificationToken}`,
      })

      res.status(201).send({ 
        status: "ok",
        message: "Email verifikasi terkirim, silahkan cek email anda"
      })      
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async verifyUser(req: Request, res: Response) {
    try {
      const { token, password, name} = req.body;
      const referralCode = generateReferralCode(name)
      const decoded = verify(token, process.env.SECRET_JWT!) as { email: string};
      const salt = await genSalt(10)
      const hashPassword = await hash(password, salt)
      
      const user = await prisma.user.update({
        where: { email: decoded.email},
        data: {
         isVerified: true,
         password: hashPassword,
         name: name,
         referralCode: referralCode,
         verificationToken: null
        }
      })

      res.status(201).send({
        status: "ok",
        msg: 'akun berhasil dibuat, silahkan login',
        user
      })

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
        where: { email: email }
      })
      if (!existingUser) throw 'Akun tidak ditemukan';
      if (!existingUser.isVerified) throw "author not verify !"

      const isValidPass = await compare(password, existingUser.password);

      if (!isValidPass) throw "password salah"

      const payload = { id: existingUser.id, role: existingUser.role }
      const token = sign(payload, process.env.SECRET_JWT!, { expiresIn: '2w'})

      res.status(200).send({
        status: 'ok',
        msg: "Berhasil masuk",
        token,
        user: existingUser,
      })
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
>>>>>>>>> Temporary merge branch 2
    }
  }
}
