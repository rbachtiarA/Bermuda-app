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
    this.router.post('/', verifyToken, this.addressController.createAddress);
    this.router.put('/:id', verifyToken, this.addressController.updateAddress)
    this.router.get('/update', this.addressController.updateProvince);
    this.router.get('/cities', this.addressController.getCities);
    this.router.get('/shippingCost', this.addressController.getShippingCost);
    this.router.delete('/:id', this.addressController.deleteAddress);
  }

  getRouter(): Router {
    return this.router;
  }
}
