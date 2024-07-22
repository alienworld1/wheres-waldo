import express, {
  Express,
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import dotenv from 'dotenv';
import createHttpError from 'http-errors';
import * as mongoose from 'mongoose';
import indexRouter from './routes/index';
import cors from 'cors';
import compression from 'compression';

dotenv.config();

const app: Express = express();
const port = process.env.port || 3000;

const mongoDB = process.env.MONGODB_URL || '';
mongoose.set('strictQuery', false);
mongoose.connect(mongoDB).catch(err => console.error(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(compression());

app.use('/api', indexRouter);
app.use((req, res, next) => next(createHttpError(404)));

const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const error = req.app.get('env') === 'development' ? err : {};
  const status = (err as any).status || 500;

  res.status(status).json({
    status,
    message: err.message,
    error,
  });
};

app.use(errorHandler);

app.listen(port, () => console.log(`App listening on port ${port}!`));
