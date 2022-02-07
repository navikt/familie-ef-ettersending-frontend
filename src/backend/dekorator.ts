import { RequestHandler } from 'express';

import { injectDecoratorServerSide } from '@navikt/nav-dekoratoren-moduler/ssr';

import environment from './environment';
import path from 'path';

export const indexHandler: RequestHandler = (_req, res) => {
  injectDecoratorServerSide({
    env: environment().dekoratørEnv,
    filePath: `${path.join(process.cwd(), 'dist')}/index.html`,
    simple: true,
    chatbot: true,
  })
    .then((html) => {
      res.send(html);
    })
    .catch((e) => {
      console.log(e);
      const error = `En feil oppstod. Klikk <a href='https://www.nav.no'>her</a> for å gå tilbake til nav.no. Kontakt kundestøtte hvis problemet vedvarer.`;
      res.status(500).send(error);
    });
};
export default indexHandler;
