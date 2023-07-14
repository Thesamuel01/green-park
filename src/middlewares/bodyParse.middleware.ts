import { type Router, type Express } from 'express';
import bodyParser from 'body-parser';

export const bodyParse = (app: Express | Router): void => {
  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
};
