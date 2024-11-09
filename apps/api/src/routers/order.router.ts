import { OrderController } from '@/controllers/order.controller';
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
    //get rid userId params when verify middleware implemented
    this.router.get('/user/:userId/order/:orderId', this.orderController.getOrderById);
    this.router.get('/user/:userId', this.orderController.getUserOrder);
    this.router.get('/store/:userId', this.orderController.getStoreOrder);
    this.router.get('/pending/:userId', this.orderController.getPendingOrder);
    this.router.post('/neworder', this.orderController.createNewOrder);
    this.router.get('/gateway/status/:orderId', this.orderController.getMidtransStatus);
    this.router.patch('/cancel', this.orderController.cancelOrder);
    this.router.patch('/complete', this.orderController.patchCompletedOrder);
    this.router.patch('/paymentProof', uploader("paymentProof-", "/paymentProof").single('paymentProof'), this.orderController.updatePaymentProof);
  }

  getRouter(): Router {
    return this.router;
  }
}
