
import { Request, Response } from 'express';
import prisma from '@/prisma';
import { sign, verify} from 'jsonwebtoken'
import { transporter } from '@/helpers/nodemailer';
import { compare, genSalt, hash} from 'bcrypt'
import { generateReferralCode } from '@/helpers/referral';
import path from 'path';
import fs from 'fs'
import handlebars from 'handlebars';

export class UserController {
  async getUsers(req: Request, res: Response) {
    try {
     const usersData = await prisma.user.findMany();


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

      
      await prisma.user.create({
        data: {
          email,
          name: "",
          password: "",
          isVerified: false,
          referralCode: ""
        }
      });

      const payload = { email }
      const token = sign(payload, process.env.SECRET_JWT!, { expiresIn: '1h'});

      const templatePath = path.join(__dirname, "../templates", "verification.hbs")
      const templateSource = fs.readFileSync(templatePath, 'utf-8')
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({
        link: `${process.env.BASE_URL}/verify/${token}`
      })

      await transporter.sendMail({
        to: email,
        subject: 'Sealamat Datang di BertigaMart',
        html: html
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
      const { password, name} = req.body;
      const { token } = req.params;
      const referralCode = generateReferralCode(name)
      const decoded = verify(token, process.env.SECRET_JWT!) as { email: string};      
      const salt = await genSalt(10)
      const hashPassword = await hash(password, salt)

      const user = await prisma.user.findUnique({
        where: {email: decoded.email}
      })
      if (user?.isVerified) throw 'Invalid Link: User already verified'

      await prisma.user.update({
        where: { email: decoded.email},
        data: {
         isVerified: true,
         password: hashPassword,
         name: name,
         referralCode: referralCode,
         //make empty cart and checkout
         checkout: {
          create: {}
         },
         cart: {
          create: {}
         }
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

      if (!existingUser.password) throw 'Akun ini menggunakan login Google. Silakan login dengan Google.';

      const isValidPass = await compare(password, existingUser.password);

      if (!isValidPass) throw "password salah"

      const payload = { id: existingUser.id, role: existingUser.role }
      const token = sign(payload, process.env.SECRET_JWT!, { expiresIn: '2w'})

      res.status(200).send({
        status: 'ok',
        msg: "Berhasil masuk",
        token,
        user: {id: existingUser.id, role: existingUser.role},
      })
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
            address: true
        },
        where: { id: +userId }
      })
      
      return res.status(200).send({status: 'ok', data: userAddressess?.address})
    } catch (error) {
      return res.status(400).send({status: 'error', msg: error})
    }
  }
  
  async editAvatar (req: Request, res: Response) {
    try {
      if (!req.file) throw "no file uploaded"
      const link = `http://localhost:8000/api/public/avatar/${req.file?.filename}`
      console.log(link)
      await prisma.user.update({
        data: { avatarUrl: link },
        where: { id: req.user?.id}
      })
      console.log(req.file)
      res.status(200).send({
        status: 'ok',
        msg: "edit avatar success!"
      })
    } catch (err) {
      return res.status(400).send({status: 'error', msg: err})
    }
  }


}
