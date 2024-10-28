import { UserController } from '@/controllers/user.controller';
import { Router } from 'express';

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.userController.getUsers);
    this.router.get('/generate-dummy', this.userController.createUsersDummy);
    this.router.get('/userAddress/:userId', this.userController.getUserAddressess);
  }

  getRouter(): Router {
    return this.router;
  }
}
