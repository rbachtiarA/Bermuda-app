import { CreateOrderController } from "@/controllers/createOrder.controller";
import { verifyToken } from "@/middleware/token";
import { Router } from "express";

export class CreateOrderRouter {
    private router: Router;
    private createOrderController: CreateOrderController;

    constructor() {
        this.createOrderController = new CreateOrderController();
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/', verifyToken, this.createOrderController.createNewOrder);
    }

    getRouter(): Router {
        return this.router;
    }
}