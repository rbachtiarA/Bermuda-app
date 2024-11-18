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
    this.router.post("/", verifyToken, this.addressController.createAddress)
    this.router.get('/update', this.addressController.updateProvince)
    this.router.get('/cities', this.addressController.getCities)
    
  }

  getRouter(): Router {
    return this.router;
  }
}
