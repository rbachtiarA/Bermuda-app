import { ProductController } from '@/controllers/product.controller';
import { StoreController } from '@/controllers/store.controller';
import { checkAdmin, verifyToken } from '@/middleware/token';
import { Router } from 'express';

export class StoreRouter {
  private router: Router;
  private storeController: StoreController;

  constructor() {
    this.storeController = new StoreController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', verifyToken, checkAdmin, this.storeController.getStoresList);
    this.router.get('/stocks/:storeId', this.storeController.getStoreStocks);
    this.router.get(
      '/order',
      verifyToken,
      checkAdmin,
      this.storeController.getStoreOrders,
    );
    this.router.get(
      '/stores',
      verifyToken,
      checkAdmin,
      this.storeController.getAllStore,
    );
    this.router.get('/nearest', this.storeController.getClosestStore);
  }

  getRouter(): Router {
    return this.router;
  }
}
