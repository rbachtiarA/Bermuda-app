import { OrderController } from '@/controllers/order.controller';
import { verifyToken } from '@/middleware/token';
import { uploader } from '@/middleware/uploader';
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
    this.router.get('/', verifyToken, this.orderController.getUserOrder);
    this.router.get('/id/:orderId',verifyToken, this.orderController.getOrderById);
    this.router.get('/pending', verifyToken, this.orderController.getPendingOrder);
    this.router.patch('/cancel', verifyToken, this.orderController.userCancelOrder);
    this.router.patch('/complete', verifyToken, this.orderController.patchCompletedOrder);
    this.router.patch('/paymentProof', uploader("paymentProof-", "/paymentProof").single('paymentProof'), this.orderController.updatePaymentProof);
  }

  getRouter(): Router {
    return this.router;
  }
}
