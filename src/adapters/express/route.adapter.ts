import { type NextFunction, type Request, type Response } from 'express';
import { type Controller, type Request as HttpRequest } from '../../helpers';
import { logger } from '../../app';

export const adaptRouter = (controler: Controller) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.appendLooger(req, res);

      const httpRequest: HttpRequest = {
        body: req.body,
        file: req.file,
        logger
      };

      const httpResponse = await controler.handle(httpRequest);

      logger.info('Response:', JSON.stringify(httpResponse));

      return res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error) {
      next(error);
    }
  };
};
