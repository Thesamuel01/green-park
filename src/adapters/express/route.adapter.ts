import { type NextFunction, type Request, type Response } from 'express';
import { type ProcessCsvController } from '../../api/controllers/processCsv.controller';
import { type Request as HttpRequest } from '../../helpers';
import { logger } from '../pino';

export const adaptRouter = (controler: ProcessCsvController) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.appendLooger(req, res);

      const httpRequest: HttpRequest = {
        body: req.body,
        file: req.file,
        logger
      };

      const httpResponse = await controler.handle(httpRequest);

      return res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error) {
      next(error);
    }
  };
};