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
    //get rid userId params when verify middleware implemented
    this.router.get('/order/:orderId',verifyToken, this.orderController.getOrderById);
    this.router.get('/', verifyToken, this.orderController.getUserOrder);
    this.router.get('/store', verifyToken, this.orderController.getStoreOrder);
    this.router.get('/pending', verifyToken, this.orderController.getPendingOrder);
    this.router.post('/neworder',verifyToken, this.orderController.createNewOrder);
    this.router.get('/gateway/status/:orderId', this.orderController.getMidtransStatus);
    this.router.patch('/cancel', verifyToken, this.orderController.cancelOrder);
    this.router.patch('/complete', verifyToken, this.orderController.patchCompletedOrder);
    this.router.patch('/paymentProof', uploader("paymentProof-", "/paymentProof").single('paymentProof'), this.orderController.updatePaymentProof);
  }

  getRouter(): Router {
    return this.router;
  }
}
