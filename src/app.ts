import express, { Router } from 'express';
import { readdirSync } from 'fs';
import path from 'path';
import {
  allowCors,
  appendLogger,
  bodyParse,
  errorHandler
} from './middlewares';
import 'express-async-errors';

class App {
  private readonly app: express.Express;

  constructor() {
    this.app = express();
    this.setup();
    this.routing();
    this.setupErrorHandler();
  }

  private setup(): void {
    allowCors(this.app);
    bodyParse(this.app);
    appendLogger(this.app);
  }

  private routing(): void {
    const router = Router();
    const routesDir = path.join(__dirname, 'api', 'routes');

    this.app.use('api', router);

    try {
      readdirSync(routesDir).map(async (file) => {
        (await import(path.join(routesDir, file))).default(router);
      });
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        return;
      }

      console.error(error);
    }
  }

  private setupErrorHandler(): void {
    errorHandler(this.app);
  }

  public start(PORT: number | string): void {
    this.app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  }
}

export default App;
