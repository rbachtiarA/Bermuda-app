import { Request, Response } from 'express';
import prisma from '@/prisma';


export class UserController {
  async getUsers(req: Request, res: Response) {
    const usersData = await prisma.user.findMany()

    return res.status(200).send(usersData);
  } 
}
