import { PDFHandlerAdapter } from '../adapters/pdfHandler';
import { GetReportController } from '../api/controllers';
import { SequelizeBillRepository } from '../repositories';
import { GetReportService } from '../services';

export const makeGetReport = (): GetReportController => {
  const sequelizeBillRepository = new SequelizeBillRepository();
  const pdfHandlerAdapter = new PDFHandlerAdapter();
  const getReportService = new GetReportService(
    sequelizeBillRepository,
    pdfHandlerAdapter
  );
  const getReportController = new GetReportController(getReportService);

  return getReportController;
};
