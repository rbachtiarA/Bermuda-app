import { AccountUtilsController } from "@/controllers/accountUtils.controller";
import { Router } from "express";

export class AccountUtilsRouter {
    private router: Router;
    private accountUtilsController: AccountUtilsController;

    constructor() {
        this.accountUtilsController = new AccountUtilsController();
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/reset-password', this.accountUtilsController.resetPassword)
        this.router.patch('/new-password/:token', this.accountUtilsController.newPassword)
    }

    getRouter(): Router {
        return this.router;
      }

}