import { CartController } from '@/controllers/cart.controller';
import { SampleController } from '@/controllers/sample.controller';
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
    this.router.get('/:userId', this.cartController.getCartsItemByIdCart);
  }

  getRouter(): Router {
    return this.router;
  }
}
