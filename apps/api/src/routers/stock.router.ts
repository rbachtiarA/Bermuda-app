import { StockController } from '@/controllers/stock.controller';
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
    this.router.post('/create', this.stockController.createStock);
    this.router.get('/', this.stockController.getStocks);
    this.router.get('/:id', this.stockController.getStockById);
    this.router.put('/:id', this.stockController.updateStock);
    this.router.delete('/:id', this.stockController.deleteStock);
    this.router.get('/history/:stockId', this.stockController.getStockHistory);
  }

  getRouter(): Router {
    return this.router;
  }
}
