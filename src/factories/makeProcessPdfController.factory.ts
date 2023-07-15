import { PDFHandlerAdapter } from '../adapters/pdfHandler';
import { ProcessPdfController } from '../api/controllers';
import {
  SequelizeBillRepository,
  SequelizeLotRepository
} from '../repositories';
import { ProcessPdfService } from '../services';

export const makeProcessPdfController = (): ProcessPdfController => {
  const pdfHandler = new PDFHandlerAdapter();
  const sequelizeLotRepository = new SequelizeLotRepository();
  const sequelizeBillRepository = new SequelizeBillRepository();
  const processPdfService = new ProcessPdfService(
    sequelizeLotRepository,
    sequelizeBillRepository,
    pdfHandler
  );
  const processPdfController = new ProcessPdfController(processPdfService);

  return processPdfController;
};
