/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Router } from 'express';
import { adaptRouter } from '../../adapters/express/route.adapter';
import { makeProcessCsvController } from '../../factories';
import { appendFile } from '../../middlewares';
import { reqValidation } from '../../adapters/express/reqValidation.adapter';
import { ProcessCsvValidation } from '../validations';

export default (router: Router): void => {
  appendFile(router);

  router.post(
    '/csv',
    reqValidation(ProcessCsvValidation),
    adaptRouter(makeProcessCsvController())
  );
};
