import { GetReportController } from '../api/controllers';
import { SequelizeBillRepository } from '../repositories';
import { GetReportService } from '../services';

export const makeGetReport = (): GetReportController => {
  const sequelizeBillRepository = new SequelizeBillRepository();
  const getReportService = new GetReportService(sequelizeBillRepository);
  const getReportController = new GetReportController(getReportService);

  return getReportController;
};
