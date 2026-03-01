import { Request, Response } from 'express';
import prisma from '@/prisma';

export class CartController {
  async getCart(req: Request, res: Response) {
    const data = await prisma.cartItem.findMany();

    return res.status(200).send(data);
  }
  async getCartsItemByIdCart(req: Request, res: Response) {
    try {
      //this variable need to be middleware where from cookies is checked then return the cart id, ---done
      const { storeId } = req.params;
      const userId = req.user?.id;
      const userCart = await prisma.user.findUnique({
        where: { id: +userId! },
        select: {
          cart: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!userCart) throw 'User is not exist';

      const cartData = await prisma.cartItem.findMany({
        include: {
          product: {
            include: {
              stock: {
                where: { storeId: +storeId },
              },
            },
          },
        },
        where: { cartId: userCart.cart?.id },
      });

      return res.status(200).send({ status: 'ok', data: cartData });
    } catch (error) {
      return res.status(400).send({ status: 'error', msg: error });
    }
  }

  async postCartsItem(req: Request, res: Response) {
    try {
      const { productId, quantity, userId } = req.body;
      //check is user exist, then give cart Id
      const userCart = await prisma.cart.findUnique({
        where: { userId: +userId },
      });

      if (!userCart) {
        throw 'User/Cart not found';
      }

      const cartItem = await prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: userCart?.id,
            productId: productId,
          },
        },
        update: {
          quantity: {
            increment: quantity,
          },
        },
        create: {
          cartId: userCart.id,
          productId: productId,
          quantity,
        },
      });
      return res.status(200).send({ status: 'ok', cartItem });
    } catch (error) {
      return res.status(400).send({ status: 'error', error });
    }
  }

  async updateQuantityCartItem(req: Request, res: Response) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user?.id;
      //check is user exist, then give cart Id
      const user = await prisma.user.findUnique({
        select: { cart: true },
        where: {
          id: +userId!,
        },
      });
      if (!user?.cart) throw 'User not found';

      const productInCart = await prisma.cartItem.findFirst({
        where: {
          AND: {
            cartId: user.cart.id,
            productId: productId,
          },
        },
      });
      if (!productInCart) throw 'Item in Cart is invalid';

      //updated product quantity in Cart
      const updatedCartItem = await prisma.cartItem.update({
        where: {
          id: productInCart.id,
        },
        data: {
          quantity: quantity,
        },
        select: {
          id: true, // Menyertakan ID cartItem
          quantity: true, // Menyertakan jumlah baru
          product: {
            include: {
              discounts: true, // Menyertakan diskon terkait produk
            },
          },
        },
      });

      return res.status(200).send({ status: 'ok', data: updatedCartItem });
    } catch (error) {
      return res.status(400).send({ status: 'error', error });
    }
  }

  async deleteCartItem(req: Request, res: Response) {
    try {
      const { cartIds } = req.query;
      const userId = req.user?.id;
      const deletedIds = `${cartIds}`.split(',').map((item) => Number(item));
      const cart = await prisma.cart.findUnique({
        where: {
          userId: +userId!,
        },
      });

      if (!cart) throw 'User is invalid';
      await prisma.$transaction(async (tx) => {
        const deletedItem = await tx.cartItem.deleteMany({
          where: {
            cartId: cart?.id,
            productId: { in: deletedIds },
          },
        });

        if (deletedItem.count !== deletedIds.length)
          throw 'Invalid Checkout Id';
      });

      return res.status(200).send({ status: 'ok', data: deletedIds });
    } catch (error) {
      return res.status(400).send({ status: 'error', msg: error });
    }
  }
}
