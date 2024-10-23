import { Request, Response } from 'express';
import prisma from '@/prisma';


export class CartController {
  async getCart(req:Request, res:Response) {
    const data = await prisma.cartItem.findMany()

    return res.status(200).send(data)
  }
  async getCartsItemByIdCart(req: Request, res: Response) {
    try {
        //this variable need to be middleware where from cookies is checked then return the cart id
        console.log(req.params);
        
        const { userId } = req.params

        const userCart = await prisma.user.findUnique({
          select: {
            cart: {
              select: {
                id: true
              }
            }
          }
          ,
          where: {
            id: +userId
          }
        })
        if(!userCart) throw 'User is not exist'

        const cartData = await prisma.cartItem.findMany({
          include: {
            product:true
          },
          where: {cartId: userCart.cart?.id}
          })
      
        return res.status(200).send({status: 'ok', data: cartData})
    } catch (error) {
        return res.status(400).send({status: 'error', msg: error});
    }

  }

  async postCartsItem(req: Request, res: Response) {
    try {
      const { userId, productId, quantity } = req.body
      
      //check is user exist, then give cart Id
      const user = await prisma.user.findUnique({
        select: { cart: true },
        where: {
          id: +userId
        }
      })
      if (!user?.cart) throw 'User not found'

      //check is product Id, already exist
      const productInCart = await prisma.cartItem.findFirst({
        where: {
          AND: {
            cartId: user.cart.id,
            productId: productId
          }
        }
      })

      let cartItem;
      if(!productInCart) {
        //new product in Cart
        cartItem = await prisma.cartItem.create({
          data: {
            cartId: user.cart?.id!,
            productId,
            quantity,
            totalPrice: 0
          } 
        })
      } else {
        //updated product quantity in Cart
        cartItem = await prisma.cartItem.update({
          where: {
            id: productInCart.id
          },
          data: {
            quantity: productInCart.quantity + quantity
          }
        })
      }

      
      return res.status(200).send({status: 'ok', data: cartItem})
    } catch (error) {
      return res.status(400).send({status: 'error', error})
      
    }
  }

  async updateQuantityCartItem(req: Request, res: Response) {
    try {
      const { userId, productId, quantity } = req.body
      
      //check is user exist, then give cart Id
      const user = await prisma.user.findUnique({
        select: { cart: true },
        where: {
          id: +userId
        }
      })
      if (!user?.cart) throw 'User not found'

      const productInCart = await prisma.cartItem.findFirst({
        where: {
          AND: {
            cartId: user.cart.id,
            productId: productId
          }
        }
      })
      if (!productInCart) throw 'Item in Cart is invalid'

      //updated product quantity in Cart
      const updatedCartItem = await prisma.cartItem.update({
        where: {
          id: productInCart.id
        },
        data: {
          quantity: quantity
        }
      })
      
      return res.status(200).send({status: 'ok', data: updatedCartItem})
    } catch (error) {
      return res.status(400).send({status: 'error', error})
      
    }
  }

  async deleteCartItem(req: Request, res: Response) {
    try {
      const { cartItemId} = req.params

      const deletedItem = await prisma.cartItem.delete({
        where: { id: +cartItemId}
      })

      return res.status(200).send({status: 'ok', data: deletedItem})
    } catch (error) {
      return res.status(400).send({status: 'error', msg: error})
    }
  }
  async getSampleDataById(req: Request, res: Response) {
    const { id } = req.params;

    const sample = await prisma.sample.findUnique({
      where: { id: Number(id) },
    });

    if (!sample) {
      return res.send(404);
    }

    return res.status(200).send(sample);
  }

  async createSampleData(req: Request, res: Response) {
    const { name, code } = req.body;

    const newSampleData = await prisma.sample.create({
      data: { name, code },
    });

    return res.status(201).send(newSampleData);
  }
}

console.log('Hello')
