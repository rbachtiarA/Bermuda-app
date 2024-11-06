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
<<<<<<<<< Temporary merge branch 1
    // const sampleRouter = new SampleRouter();
=========
>>>>>>>>> Temporary merge branch 2
    const userRouter = new UserRouter();
    const productRouter = new ProductRouter();
    const cartRouter = new CartRouter()

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

<<<<<<<<< Temporary merge branch 1
    // this.app.use('/api/samples', sampleRouter.getRouter());
=========
>>>>>>>>> Temporary merge branch 2
    this.app.use('/api/users', userRouter.getRouter());
    this.app.use('/api/product', productRouter.getRouter());
    this.app.use('/api/cart', cartRouter.getRouter());
    
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
