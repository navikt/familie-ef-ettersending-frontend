import { RequestHandler } from 'express';

import { injectDecoratorServerSide } from '@navikt/nav-dekoratoren-moduler/ssr';

import path from 'path';
import logger from './logger';
import environment from './environment';

export const indexHandler: RequestHandler = (_req, res) => {
  getHtmlWithDecorator(`${path.join(process.cwd(), 'dist')}/index.html`)
    .then((html) => {
      res.send(html);
    })
    .catch((e) => {
      console.log(e);
      const error = `En feil oppstod. Klikk <a href='https://www.nav.no'>her</a> for å gå tilbake til nav.no. Kontakt kundestøtte hvis problemet vedvarer.`;
      res.status(500).send(error);
    });
};

const getHtmlWithDecorator = (filePath: string) => {
  const env = environment().dekoratørEnv;
  if (env === undefined) {
    logger.error('Mangler miljø for dekoratøren');
    throw Error('Miljø kan ikke være undefined');
  }

  const dekoratørConfig = {
    env: env,
    filePath: filePath,
    params: {
      simple: true,
      enforceLogin: false,
      redirectToApp: true,
      level: 'Level4',
      chatbot: true,
    },
  };

  return injectDecoratorServerSide(dekoratørConfig);
};
export default indexHandler;
