import { CheckoutController } from '@/controllers/checkout.controller';
import { verifyToken } from '@/middleware/token';
import { Router } from 'express';

export class CheckoutRouter {
  private router: Router;
  private checkoutController: CheckoutController;

  constructor() {
    this.checkoutController = new CheckoutController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', verifyToken, this.checkoutController.getCheckoutByUserId);
    // when selected cart ready to checkout
    this.router.post('/', verifyToken, this.checkoutController.updateCheckoutCartItem);
  }

  getRouter(): Router {
    return this.router;
  }
}
