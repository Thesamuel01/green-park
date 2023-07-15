import { pino, type Logger as PinoLoggerType } from 'pino';
import { pinoHttp, type HttpLogger } from 'pino-http';
import { type Logger } from '..';
import { type Response, type Request } from 'express';

export class PinoLogger implements Logger {
  private readonly pinoAdapter: PinoLoggerType;
  private readonly pinoHttpAdapter: HttpLogger;

  constructor() {
    this.pinoAdapter = pino({
      enabled: process.env.NODE_ENV !== 'test',
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'SYS:dd-mm-yyyy HH:MM:ss'
        }
      }
    });

    this.pinoHttpAdapter = pinoHttp(this.pinoAdapter);
  }

  appendLooger(req: Request, res: Response): void {
    // this.pinoHttpAdapter(req, res);
    this.pinoHttpAdapter(req, res);
  }

  info(...data: unknown[]): void {
    // this.pinoAdapter.info(data);
    console.log(data);
  }

  warn(...data: unknown[]): void {
    this.pinoAdapter.warn(data);
    console.log(data);
  }

  error(...data: unknown[]): void {
    // this.pinoAdapter.error(data);
    console.log(data);
  }
}

export const logger = new PinoLogger();
