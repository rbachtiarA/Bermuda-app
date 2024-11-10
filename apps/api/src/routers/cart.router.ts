import { CartController } from '@/controllers/cart.controller';
import { verifyToken } from '@/middleware/token';
import { Router } from 'express';

export class CartRouter {
  private router: Router;
  private cartController: CartController;

  constructor() {
    this.cartController = new CartController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.cartController.getCart);
    this.router.post('/', verifyToken, this.cartController.postCartsItem);
    this.router.put('/',verifyToken, this.cartController.updateQuantityCartItem);
    this.router.delete('/remove/:cartItemId', this.cartController.deleteCartItem);
    this.router.get('/store/:storeId', verifyToken, this.cartController.getCartsItemByIdCart);
    this.router.get('/checkout', verifyToken, this.cartController.getCheckoutByUserId);
    // when selected cart ready to checkout
    this.router.post('/checkout', verifyToken, this.cartController.updateCheckoutCartItem);
    // when checkout success, should generate payment, order with list order item
    this.router.post('/checkoutSuccess',verifyToken, this.cartController.removeCheckoutCartItem);
  }

  getRouter(): Router {
    return this.router;
  }
}
