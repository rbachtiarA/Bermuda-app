import { AuthController } from "@/controllers/auth.controller";
import { Router } from "express";

export class AuthRouter {
    private router: Router;
    private authController: AuthController;

    constructor() {
        this.authController = new AuthController();
        this.router = Router();
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post('/google/callback', this.authController.googleAuthCallback)
    }
    getRouter(): Router {
        return this.router;
    }
}