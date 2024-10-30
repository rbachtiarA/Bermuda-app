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
        const { userId, storeId } = req.params

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
            product: {
              include: {
                stock: {
                  //change storeId value when store is dyncamic
                  where: {storeId: +storeId}
                }
              }
            },
            

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
      if (!user?.cart) throw 'User / Cart not found'

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

      
      return res.status(200).send({status: 'ok', cartItem})
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

  async getCheckoutByUserId(req:Request, res:Response) {

    // this variable should change, when middleware auth is implemented req.user
    const {userId} = req.params
    const data = await prisma.checkout.findUnique({
      select: { CartItem: {
        include: { product: true }
      } },
      where: {
        userId: +userId
      }
    })

    return res.status(200).send({status: 'ok', data: data})
  }
  // update cartItem checkout and remove Checkout from cart Item
  async updateCheckoutCartItem(req: Request, res: Response) {
    try {
      //change variable userId to auth system, selectIds collection of selected Item
      const { userId, selectedIds } = req.body

      //verify is userId valid,and then return checkoutId
      const userCheckoutId = await prisma.user.findUnique({
        where: { id: +userId},
        select: {
          Checkout: {
            select: {
              id: true
            }
          }
        }
      })
      if(!userCheckoutId) throw 'Invalid user'

      //update every cart item inside user cart checkout to null
      const previousSelectedItem = await prisma.checkout.update({
        where: {
          id: userCheckoutId.Checkout?.id
        },
        data: {
          CartItem: {
            set: []
          }
        } 

        }
      )

      //update cartItem which id inside selectedIds
      const updatedData = await prisma.cartItem.updateMany({
        where: {
          id: {
            in: selectedIds
          }
        },
        data: {
          checkoutId: userCheckoutId.Checkout?.id
        }
      })

      return res.status(200).send({status: 'ok', msg: 'selectedIds updated'})
    } catch (error) {
      return res.status(400).send({status: 'error', msg: error})
    }
  }

  async removeCheckoutCartItem(req: Request, res: Response) {
    try {
       //change variable userId to auth system, selectIds collection of selected Item
       const { userId } = req.body

       //verify is userId valid,and then return checkoutId
       const userCheckoutId = await prisma.user.findUnique({
         where: { id: +userId},
         select: {
           Checkout: {
             select: {
               id: true
             }
           }
         }
       })
       if(!userCheckoutId) throw 'Invalid user'

       //remove cart items from cart if checkout success
       const removedItems = await prisma.cartItem.deleteMany({
        where: {
          checkoutId: userCheckoutId.Checkout?.id
        }
       })
        
       
       return res.status(200).send({status: 'ok', msg: 'cart item removed, checkout success'})
    } catch (error) {
      return res.status(400).send({status: 'error', msg: error})
    }
  }
}

console.log('Hello')
