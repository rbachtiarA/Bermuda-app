import prisma from '@/prisma';
import { Request, Response } from 'express';

export class CheckoutController {
  async getCheckoutByUserId(req: Request, res: Response) {
    const userId = req.user?.id;
    const data = await prisma.checkout.findUnique({
      select: {
        CartItem: {
          include: { product: { include: { stock: true } } },
        },
      },
      where: {
        userId: +userId!,
      },
    });

    return res.status(200).send({ status: 'ok', data: data });
  }

  // update cartItem checkout and remove Checkout from cart Item
  async updateCheckoutCartItem(req: Request, res: Response) {
    try {
      const { selectedIds } = req.body;
      const userId = req.user?.id;

      if (!Array.isArray(selectedIds)) {
        return res.status(400).send({
          status: 'error',
          msg: 'invalid body format',
        });
      }

      const parsedIds = selectedIds.map((id) => Number(id));
      if (parsedIds.some((id) => Number.isNaN(id))) {
        return res.status(400).send({
          status: 'error',
          msg: 'invalid body format',
        });
      }

      //verify is userId valid,and then return checkoutId
      const user = await prisma.user.findUnique({
        where: { id: +userId! },
        select: {
          checkout: {
            select: {
              id: true,
            },
          },
          cart: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!user) throw 'Invalid user';

      await prisma.$transaction([
        //update every cart item inside user cart checkout to null
        prisma.cartItem.updateMany({
          where: {
            checkoutId: user.checkout?.id,
          },
          data: {
            checkoutId: null,
          },
        }),
        //update cartItem which id inside selectedIds
        prisma.cartItem.updateMany({
          where: {
            cartId: user.cart?.id,
            productId: {
              in: parsedIds,
            },
          },
          data: {
            checkoutId: user.checkout?.id,
          },
        }),
      ]);

      return res.status(200).send({ status: 'ok', msg: 'selectedIds updated' });
    } catch (error) {
      return res.status(400).send({ status: 'error', msg: error });
    }
  }
}
