import { FastCsvReader } from '../adapters/fastCsv';
import { ProcessCsvController } from '../api/controllers/processCsv.controller';
import {
  SequelizeBillRepository,
  SequelizeLotRepository
} from '../repositories/sequelize';
import { ProcessCSVService } from '../services/processCsv.service';

export const makeProcessCsvController = (): ProcessCsvController => {
  const fastCsvReader = new FastCsvReader();
  const sequelizeLotRepository = new SequelizeLotRepository();
  const sequelizeBillRepository = new SequelizeBillRepository();
  const processCsvService = new ProcessCSVService(
    sequelizeLotRepository,
    sequelizeBillRepository,
    fastCsvReader
  );
  const processCsvController = new ProcessCsvController(processCsvService);

  return processCsvController;
};
