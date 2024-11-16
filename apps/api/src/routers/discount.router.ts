import { DiscountController } from '@/controllers/discount.controller';
import { verifyToken } from '@/middleware/token';
import { Router } from 'express';

export class DiscountRouter {
  private router: Router;
  private discountController: DiscountController;

  constructor() {
    this.discountController = new DiscountController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/store/:storeId', verifyToken, this.discountController.getAvailableDiscountOnCheckout)
    this.router.get('/address', this.discountController.updateProvince)
  }

  getRouter(): Router {
    return this.router;
  }
}
