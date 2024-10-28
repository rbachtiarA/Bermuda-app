import { Request, Response } from 'express';
import prisma from '@/prisma';


export class UserController {
  async getUsers(req: Request, res: Response) {
    const usersData = await prisma.user.findMany()

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
    }
  }
}
