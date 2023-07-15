import { pino, type Logger as PinoLoggerType } from 'pino';
import { pinoHttp, type HttpLogger } from 'pino-http';
import { type Logger } from '..';
import { type Response, type Request } from 'express';
import { randomUUID } from 'crypto';

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

    this.pinoHttpAdapter = pinoHttp({
      logger: this.pinoAdapter,

      // Define a custom request id function
      genReqId: function (req, res) {
        const existingID = req.id ?? req.headers['x-request-id'];

        if (existingID != null) return existingID;

        const id = randomUUID();
        res.setHeader('X-Request-Id', id);

        return id;
      }
    });
  }

  appendLooger(req: Request, res: Response): void {
    this.pinoHttpAdapter(req, res);
  }

  info(...data: unknown[]): void {
    this.pinoAdapter.info(data);
  }

  warn(...data: unknown[]): void {
    this.pinoAdapter.warn(data);
  }

  error(...data: unknown[]): void {
    this.pinoAdapter.error(data);
  }
}
