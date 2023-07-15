import { type NextFunction, type Request, type Response } from 'express';
import Joi from 'joi';
import { HttpError } from '../../helpers';

export const reqValidation =
  <T extends Joi.PartialSchemaMap>(schema: T) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const reqSchema = Joi.object().keys(schema).unknown(true);

    const { error } = reqSchema.validate(req);

    if (error != null) {
      const message = error.details.reduce(
        (acc, d) => (acc += `${d.message}\n`),
        ''
      );

      throw HttpError.badRequest(message);
    }

    next();
  };
