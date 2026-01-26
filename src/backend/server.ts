import path from 'path';
import express from 'express';
import indexHandler from './dekorator.js';
import environment from './environment.js';
import routes from './routes.js';

async function startServer() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const frontendMappe = path.join(process.cwd(), 'dist');

  app.set('views', frontendMappe);
  app.set('view engine', 'mustache');

  app.use(routes());

  if (process.env.NODE_ENV !== 'development') {
    app.use(
      '/familie/alene-med-barn/ettersending/',
      express.static(frontendMappe, { index: false }),
    );
  }

  app.get('/', indexHandler);

  if (process.env.NODE_ENV === 'development') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.locals.vite = vite;
    app.use(vite.middlewares);
  }

  app.get('/*splat', indexHandler);

  console.log('server listening on port', environment().port);

  app.listen(environment().port);
}

startServer();
