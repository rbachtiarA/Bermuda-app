import { AddressController } from '@/controllers/address.controller';
import { DiscountController } from '@/controllers/discount.controller';
import { verifyToken } from '@/middleware/token';
import { Router } from 'express';

export class AddressRouter {
  private router: Router;
  private addressController: AddressController;

  constructor() {
    this.addressController = new AddressController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/update', this.addressController.updateProvince)
  }

  getRouter(): Router {
    return this.router;
  }
}
