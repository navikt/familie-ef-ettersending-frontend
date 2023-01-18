import express from 'express';
import { addCallId, doProxy } from './proxy';
import attachToken from './tokenProxy';
import environment from './environment';

const BASE_PATH = `/familie/alene-med-barn/ettersending/`;

const routes = () => {
  const expressRouter = express.Router();

  expressRouter.use(
    `${BASE_PATH}/api`,
    addCallId(),
    attachToken('familie-ef-soknad-api'),
    doProxy(environment().apiUrl, `${BASE_PATH}/api`)
  );

  expressRouter.use(
    `${BASE_PATH}/dokument`,
    addCallId(),
    attachToken('familie-dokument'),
    doProxy(environment().dokumentUrl, `${BASE_PATH}/dokument`)
  );

  return expressRouter;
};

export default routes;
