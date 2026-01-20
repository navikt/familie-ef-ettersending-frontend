import express, { Router } from 'express';
import { addCallId, doProxy } from './proxy.js';
import attachToken from './tokenProxy.js';
import environment from './environment.js';

const BASE_PATH = `/familie/alene-med-barn/ettersending`;

const routes = (): Router => {
  const expressRouter = express.Router();

  expressRouter.get(
    [`${BASE_PATH}/internal/isAlive`, `${BASE_PATH}/internal/isReady`],
    (req, res) => res.sendStatus(200),
  );

  expressRouter.use(
    `${BASE_PATH}/api`,
    addCallId(),
    attachToken('familie-ef-soknad-api'),
    doProxy(environment().apiUrl),
  );

  expressRouter.use(
    `${BASE_PATH}/dokument`,
    addCallId(),
    attachToken('familie-dokument'),
    doProxy(environment().dokumentUrl),
  );

  return expressRouter;
};

export default routes;
