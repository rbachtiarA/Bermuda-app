import { DiscountController } from '@/controllers/discount.controller';
import { verifyToken } from '@/middleware/token';
import { Router } from 'express';
import { checkStoreAdmin } from '../middleware/token';

export class DiscountRouter {
  private router: Router;
  private discountController: DiscountController;

  constructor() {
    this.discountController = new DiscountController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.discountController.getDiscount);
    this.router.get(
      '/store/:storeId',
      verifyToken,
      this.discountController.getAvailableDiscountOnCheckout,
    );
    this.router.get('/address', this.discountController.updateProvince);
    this.router.post(
      '/manual',
      verifyToken,
      checkStoreAdmin,
      this.discountController.createManualDiscount,
    );
    this.router.post(
      '/conditional',
      verifyToken,
      checkStoreAdmin,
      this.discountController.createConditionalDiscount,
    );
    this.router.post(
      '/bogo',
      verifyToken,
      checkStoreAdmin,
      this.discountController.createBuyOneGetOneDiscount,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
