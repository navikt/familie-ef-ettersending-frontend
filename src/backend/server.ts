import path from 'path';
import express from 'express';
import indexHandler from './dekorator.js';
import environment from './environment.js';
import routes from './routes.js';

const app = express();
const frontendMappe = path.join(process.cwd(), 'dist');

app.set('views', frontendMappe);
app.set('view engine', 'mustache');

app.get('/', indexHandler);

const erDevelopment = process.env.NODE_ENV === 'development';

(async () => {
  if (erDevelopment) {
    // Register API routes before Vite middleware
    app.use(routes());

    const viteModule = await import('vite');
    const viteDevServer = await viteModule.createServer({
      server: { middlewareMode: true },
      root: process.cwd(),
      appType: 'custom',
    });
    app.use(viteDevServer.middlewares);
  } else {
    app.use(
      '/familie/alene-med-barn/ettersending/',
      express.static(frontendMappe, { index: false }),
    );
    app.use(routes());
  }

  app.get('/*splat', indexHandler);

  console.log('server listening on port', environment().port);
  app.listen(environment().port);
})();
