import { CartController } from '@/controllers/cart.controller';
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
    this.router.post('/', this.cartController.postCartsItem);
    this.router.put('/', this.cartController.updateQuantityCartItem);
    this.router.delete('/remove/:cartItemId', this.cartController.deleteCartItem);
    this.router.get('/:userId/store/:storeId', this.cartController.getCartsItemByIdCart);
    this.router.get('/checkout/:userId', this.cartController.getCheckoutByUserId);
    // when selected cart ready to checkout
    this.router.post('/checkout', this.cartController.updateCheckoutCartItem);
    // when checkout success, should generate payment, order with list order item
    this.router.post('/checkoutSuccess', this.cartController.removeCheckoutCartItem);
  }

  getRouter(): Router {
    return this.router;
  }
}
