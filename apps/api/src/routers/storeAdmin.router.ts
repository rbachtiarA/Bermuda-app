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
    this.router.get(
      '/storeadmins',
      verifyToken,
      checkSuperAdmin,
      this.storeAdminController.getStoreAdmin,
    );
    this.router.get(
      '/:id',
      verifyToken,
      checkSuperAdmin,
      this.storeAdminController.getStoreAdminById,
    );
    this.router.delete(
      '/:id',
      verifyToken,
      checkSuperAdmin,
      this.storeAdminController.deleteStoreAdmin,
    );
    this.router.put(
      '/:id',
      verifyToken,
      checkSuperAdmin,
      this.storeAdminController.updateStoreAdmin,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
