import { OrderController } from '@/controllers/order.controller';
import { Router } from 'express';

export class OrderRouter {
  private router: Router;
  private orderController: OrderController;

  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/user/:userId/order/:orderId', this.orderController.getOrderById);
    this.router.get('/pending/:userId', this.orderController.getPendingOrder);
    this.router.post('/neworder', this.orderController.createNewOrder);
    this.router.get('/gateway/status/:orderId', this.orderController.getMidtransStatus);
  }

  getRouter(): Router {
    return this.router;
  }
}
