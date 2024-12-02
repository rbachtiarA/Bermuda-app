import { CategoryController } from '@/controllers/category.controller';
import { checkSuperAdmin, verifyToken } from '@/middleware/token';
import { Router } from 'express';

export class CategoryRouter {
  private router: Router;
  private categoryController: CategoryController;

  constructor() {
    this.categoryController = new CategoryController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/categories', this.categoryController.getCategory);
    this.router.post(
      '/create',
      verifyToken,
      checkSuperAdmin,
      this.categoryController.createCategory,
    );
    this.router.post(
      '/update/:id',
      verifyToken,
      checkSuperAdmin,
      this.categoryController.updateCategory,
    );
    this.router.delete(
      '/delete/:id',
      verifyToken,
      checkSuperAdmin,
      this.categoryController.deleteCategory,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
