import { MidtransController } from "@/controllers/midtrans.controller";
import { verifyToken } from "@/middleware/token";
import { Router } from "express";

export class MidtransRouter {
    private router: Router;
    private midtransController: MidtransController;

    constructor() {
        this.midtransController = new MidtransController();
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/status/:orderId', verifyToken, this.midtransController.getMidtransStatus);
    }

    getRouter(): Router {
        return this.router;
    }
}