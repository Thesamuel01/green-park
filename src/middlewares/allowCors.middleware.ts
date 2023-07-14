import {
  type Router,
  type Express,
  type NextFunction,
  type Request,
  type Response
} from 'express';

export const allowCors = (app: Express | Router): void => {
  app.use((_req: Request, res: Response, next: NextFunction): void => {
    res.set('access-control-allow-origin', '*');
    res.set('access-control-allow-headers', '*');
    res.set('access-control-allow-methods', '*');

    next();
  });
};
