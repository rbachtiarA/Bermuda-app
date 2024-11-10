import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import { UserRouter } from './routers/user.router';
import { ProductRouter } from './routers/product.router';
import { CartRouter } from './routers/cart.router';
import { StoreRouter } from './routers/store.router';
import { OrderRouter } from './routers/order.router';
import { CategoryRouter } from './routers/category.router';
import path from 'path';
import { AuthRouter } from './routers/auth.router';
import session from 'express-session';
import passport from 'passport';
import { AdminRouter } from './routers/admin.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use('/api/public', express.static(path.join(__dirname, "../public")))
    this.app.use(session({
      secret: 'Finpro015',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    const userRouter = new UserRouter();
    const productRouter = new ProductRouter();
    const cartRouter = new CartRouter();
    const categoryRouter = new CategoryRouter();
    const authRouter = new AuthRouter();
    const storeRouter = new StoreRouter()
    const orderRouter = new OrderRouter()
    const adminRouter = new AdminRouter()
    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

    this.app.use('/api/users', userRouter.getRouter());
    this.app.use('/api/product', productRouter.getRouter());
    this.app.use('/api/cart', cartRouter.getRouter());
    this.app.use('/api/store', storeRouter.getRouter());
    this.app.use('/api/order', orderRouter.getRouter());
    this.app.use('/api/categories', categoryRouter.getRouter())
    this.app.use('/api/auth', authRouter.getRouter());
    this.app.use('/api/admin', adminRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
