import { ProductController } from '@/controllers/product.controller';
import { checkSuperAdmin, verifyToken } from '@/middleware/token';
import { uploader } from '@/middleware/uploader';
import { Router } from 'express';

export class ProductRouter {
  private router: Router;
  private productController: ProductController;

  constructor() {
    this.productController = new ProductController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.productController.ProdutSearch);
    this.router.post(
      '/create',
      uploader('product-', '/product').single('file'),
      verifyToken,
      checkSuperAdmin,
      this.productController.createOrUpdateProduct,
    );
    this.router.get('/products', this.productController.getProducts);
    this.router.delete('/:id', this.productController.deleteProduct);
  }

  getRouter(): Router {
    return this.router;
  }
}
