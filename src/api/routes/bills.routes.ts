/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Router } from 'express';
import { adaptRouter } from '../../adapters/express/route.adapter';
import {
  makeProcessCsvController,
  makeProcessPdfController,
  makeGetReport
} from '../../factories';
import { appendFile } from '../../middlewares';
import { reqValidation } from '../../adapters/express/reqValidation.adapter';
import {
  GetReportValidation,
  ProcessCsvValidation,
  ProcessPdfValidation
} from '../validations';

export default (router: Router): void => {
  appendFile(router);

  router.post(
    '/csv',
    reqValidation(ProcessCsvValidation),
    adaptRouter(makeProcessCsvController())
  );

  router.post(
    '/pdf',
    reqValidation(ProcessPdfValidation),
    adaptRouter(makeProcessPdfController())
  );

  router.get(
    '/',
    reqValidation(GetReportValidation),
    adaptRouter(makeGetReport())
  );
};
