import express, { Router } from 'express';
import { readdirSync } from 'fs';
import path from 'path';
import { allowCors, bodyParse, errorHandler } from './middlewares';
import 'express-async-errors';
import { logger } from './adapters/pino';
import sequelize from './database/models';

class App {
  private readonly app: express.Express;

  constructor() {
    this.app = express();
    this.setup();
    this.routing();
    this.setupErrorHandler();
    void this.syncModels();
  }

  private async syncModels(): Promise<void> {
    try {
      await sequelize.sync({ force: false });
      logger.info('Models synchronized with the database.');
    } catch (error) {
      logger.error('Error synchronizing models:', error);
    }
  }

  private setup(): void {
    allowCors(this.app);
    bodyParse(this.app);
  }

  private routing(): void {
    const mainRouter = Router();
    const routesDir = path.join(__dirname, 'api', 'routes');

    this.app.use('/api', mainRouter);

    try {
      readdirSync(routesDir).map(async (file) => {
        if (file.includes('.routes.')) {
          const router = Router();
          const [route] = file.split('.');

          mainRouter.use(`/${route}`, router);

          (await import(path.join(routesDir, file))).default.default(router);
        }
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
      logger.info(`Server running on port: ${PORT}`);
    });
  }
}

export default App;
