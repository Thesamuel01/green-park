import { type Express } from 'express';
import multer from 'multer';

export const appendFile = (app: Express): void => {
  const upload: multer.Multer = multer({
    storage: multer.memoryStorage()
  });

  app.use(upload.single('file'));
};
