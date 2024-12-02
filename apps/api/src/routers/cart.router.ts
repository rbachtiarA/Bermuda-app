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
    this.router.delete('/remove', verifyToken, this.cartController.deleteCartItem);
    this.router.get('/store/:storeId', verifyToken, this.cartController.getCartsItemByIdCart);
  }

  getRouter(): Router {
    return this.router;
  }
}
