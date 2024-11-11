import { AdminController } from '@/controllers/admin.controller';
import { checkAdmin, verifyToken } from '@/middleware/token';
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
    this.router.get('/isAdmin', verifyToken, checkAdmin, this.adminController.getIsAdmin)
    this.router.patch('/denypayment',verifyToken, checkAdmin, this.adminController.updateDeniedPayment);
    this.router.patch('/acceptpayment', verifyToken, checkAdmin, this.adminController.updateAcceptedPayment);
    this.router.patch('/cancelorder', verifyToken, checkAdmin, this.adminController.updateCanceledOrder);
    this.router.patch('/shiporder', verifyToken, checkAdmin, this.adminController.updateShippedOrder);
  }

  getRouter(): Router {
    return this.router;
  }
}
