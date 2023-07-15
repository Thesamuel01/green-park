/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Router } from 'express';
import { adaptRouter } from '../../adapters/express/route.adapter';
import { makeProcessCsvController } from '../../factories';
import { appendFile } from '../../middlewares';

export default (router: Router): void => {
  appendFile(router);

  router.post('/csv', adaptRouter(makeProcessCsvController()));
};
