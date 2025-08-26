import express, { Router } from 'express';
import { addCallId, doProxy } from './proxy.js';
import attachToken from './tokenProxy.js';
import environment from './environment.js';

const BASE_PATH = `/familie/alene-med-barn/ettersending`;

const routes = (): Router => {
  const expressRouter = express.Router();

  type HealthCheckRequest = express.Request;
  type HealthCheckResponse = express.Response;

  expressRouter.get(
    [`${BASE_PATH}/internal/isAlive`, `${BASE_PATH}/internal/isReady`],
    (_req: HealthCheckRequest, res: HealthCheckResponse) => res.sendStatus(200),
  );

  expressRouter.use(
    `${BASE_PATH}/api`,
    addCallId(),
    attachToken('familie-ef-soknad-api'),
    doProxy(environment().apiUrl, `${BASE_PATH}/api`),
  );

  expressRouter.use(
    `${BASE_PATH}/dokument`,
    addCallId(),
    attachToken('familie-dokument'),
    doProxy(environment().dokumentUrl, `${BASE_PATH}/dokument`),
  );

  return expressRouter;
};

export default routes;
