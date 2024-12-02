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
      uploader('memoryStorage', 'product-', '/product').single('file'),
      verifyToken,
      checkSuperAdmin,
      this.productController.createProduct,
    );
    this.router.put(
      '/:id',
      uploader('memoryStorage', 'product-', '/product').single('file'),
      verifyToken,
      checkSuperAdmin,
      this.productController.updateProduct,
    );
    this.router.get('/products', this.productController.getProducts);
    this.router.get('/:id', this.productController.getProductById);
    this.router.delete(
      '/:id',
      verifyToken,
      checkSuperAdmin,
      this.productController.deleteProduct,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
