import { RequestHandler } from 'express';
import { injectDecoratorServerSide } from '@navikt/nav-dekoratoren-moduler/ssr/index.js';
import path from 'path';
import logger from './logger.js';
import environment from './environment.js';

export const indexHandler: RequestHandler = async (req, res) => {
  try {
    const isDev = process.env.NODE_ENV === 'development';
    const htmlPath = isDev
      ? path.join(process.cwd(), 'src/frontend/index.html')
      : path.join(process.cwd(), 'dist/index.html');

    // Først får vi HTML med dekorator
    let html = await getHtmlWithDecorator(htmlPath);

    // I dev mode, transformerer Vite HTML-en etterpå
    if (isDev && req.app.locals.vite) {
      html = await req.app.locals.vite.transformIndexHtml(
        req.originalUrl,
        html,
      );
    }

    res.send(html);
  } catch (e) {
    console.log(e);
    const error = `En feil oppstod. Klikk <a href='https://www.nav.no'>her</a> for å gå tilbake til nav.no. Kontakt kundestøtte hvis problemet vedvarer.`;
    res.status(500).send(error);
  }
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
