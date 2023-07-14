import {
  type Express,
  type Request,
  type Response,
  type NextFunction,
  type Router
} from 'express';
import { HttpError } from '../helpers';

export const errorHandler = (app: Express | Router): void => {
  app.use(
    (
      err: HttpError | Error,
      req: Request,
      res: Response,
      _next: NextFunction
    ): Response => {
      const { log } = req;
      const { name, message } = err;

      log.error({ name, message });

      if (err instanceof HttpError) {
        const { statusCode } = err;

        return res.status(statusCode).json({ statusCode, message });
      }

      return res
        .status(500)
        .json({ statusCode: 500, message: 'Internal Server Error' });
    }
  );
};
