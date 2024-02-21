import express, { Router } from 'express';
import { addCallId, doProxy } from './proxy';
import attachToken from './tokenProxy';
import environment from './environment';

const BASE_PATH = `/familie/alene-med-barn/ettersending`;

const routes = (): Router => {
  const expressRouter = express.Router();

  expressRouter.get(`${BASE_PATH}/internal/isAlive|isReady`, (req, res) =>
    res.sendStatus(200),
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
