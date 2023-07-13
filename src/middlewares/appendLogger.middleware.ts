import { type Express } from 'express';
import { pino } from 'pino';
import { pinoHttp } from 'pino-http';

export const appendLogger = (app: Express): void => {
  const logger = pino({
    enabled: process.env.NODE_ENV !== 'test',
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:dd-mm-yyyy HH:MM:ss'
      }
    }
  });

  app.use(pinoHttp({ logger }));
};

export default appendLogger;
