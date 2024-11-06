
import { AuthController } from "@/controllers/auth.controller";
import { Router } from "express";
import passport from "passport";

export class AuthRouter {
    private router: Router;
    private authController: AuthController;

    constructor() {
        this.authController = new AuthController();
        this.router = Router();
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get('/google', this.authController.googleAuth)
        this.router.get("/google/callback", passport.authenticate('google', { failureRedirect: '/login'}), this.authController.googleCallback)
    }
    getRouter(): Router {
        return this.router;
    }
}