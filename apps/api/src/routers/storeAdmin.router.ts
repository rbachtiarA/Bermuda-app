import { StoreAdminController } from '@/controllers/storeAdmin.controller';
import { checkSuperAdmin, verifyToken } from '@/middleware/token';
import { Router } from 'express';

export class StoreAdminRouter {
  private router: Router;
  private storeAdminController: StoreAdminController;

  constructor() {
    this.storeAdminController = new StoreAdminController();
    this.router = Router();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.post(
      '/create',
      verifyToken,
      checkSuperAdmin,
      this.storeAdminController.createStoreAdmin,
    );
    this.router.patch(
      '/verify',
      verifyToken,
      this.storeAdminController.verifyStoreAdmin,
    );
    this.router.get(
      '/storeadmins',
      verifyToken,
      checkSuperAdmin,
      this.storeAdminController.getStoreAdmin,
    );
    this.router.delete(
      '/:id',
      verifyToken,
      checkSuperAdmin,
      this.storeAdminController.deleteStoreAdmin,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}