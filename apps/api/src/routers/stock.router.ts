import { StockController } from '@/controllers/stock.controller';
import { checkSuperAdmin, verifyToken } from '@/middleware/token';
import { Router } from 'express';

export class StockRouter {
  private router: Router;
  private stockController: StockController;

  constructor() {
    this.stockController = new StockController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/create',
      verifyToken,
      checkSuperAdmin,
      this.stockController.createStock,
    );
    this.router.get('/', this.stockController.getStocks);
    this.router.get('/:id', this.stockController.getStockById);
    this.router.put(
      '/:id',
      verifyToken,
      checkSuperAdmin,
      this.stockController.updateStock,
    );
    this.router.delete(
      '/:id',
      verifyToken,
      checkSuperAdmin,
      this.stockController.deleteStock,
    );
    this.router.get(
      '/history/:stockId/:userId',
      this.stockController.getReportSales,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
