import { AdminController } from '@/controllers/admin.controller';
import { Router } from 'express';

export class AdminRouter {
  private router: Router;
  private adminController: AdminController;

  constructor() {
    this.adminController = new AdminController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.patch('/denypayment', this.adminController.updateDeniedPayment);
    this.router.patch('/acceptpayment', this.adminController.updateAcceptedPayment);
    this.router.patch('/cancelorder', this.adminController.updateCanceledOrder);
    this.router.patch('/shiporder', this.adminController.updateShippedOrder);
  }

  getRouter(): Router {
    return this.router;
  }
}
