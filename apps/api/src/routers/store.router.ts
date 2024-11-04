import { ProductController } from '@/controllers/product.controller';
import { StoreController } from '@/controllers/store.controller';
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
    this.router.get('/stocks/:storeId', this.storeController.getStockStore);
  }

  getRouter(): Router {
    return this.router;
  }
}
