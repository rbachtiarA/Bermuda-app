import { SuperAdminController } from '@/controllers/superAdmin.controller';
import { checkSuperAdmin, verifyToken } from '@/middleware/token';
import { Router } from 'express';

export class SuperAdminRouter {
  private router: Router;
  private superAdminController: SuperAdminController;

  constructor() {
    this.router = Router();
    this.superAdminController = new SuperAdminController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      verifyToken,
      checkSuperAdmin,
      this.superAdminController.getAllStore,
    );
    this.router.post(
      '/create',
      verifyToken,
      checkSuperAdmin,
      this.superAdminController.createStore,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
