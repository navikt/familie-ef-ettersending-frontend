import path from 'path';
import express from 'express';
import indexHandler from './dekorator';
import environment from './environment';
import webpack from 'webpack';
import mustacheExpress from 'mustache-express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import projectWebpackDevConfig from '../webpack/webpack.development.config';

const app = express();

app.engine('html', mustacheExpress());

const basePath = process.env.BASE_PATH ?? '/';
console.log('base path: ', basePath);
const frontendMappe = path.join(process.cwd(), 'dist');

app.set('views', frontendMappe);
app.set('view engine', 'mustache');

app.get('/', indexHandler);

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line
  // @ts-ignore
  const compiler = webpack(projectWebpackDevConfig);
  const devMiddlewareOptions = {
    // Vi må write to disk for at index.html skal havne på et sted der mustacheExpress-renderen kan finne den
    writeToDisk: true,
  };
  app.use(webpackDevMiddleware(compiler, devMiddlewareOptions));
  app.use(webpackHotMiddleware(compiler));
} else {
  // Static files
  app.use(
    '/familie/alene-med-barn/ettersending/',
    express.static(frontendMappe, { index: false })
  );
}

// Nais functions
app.get(/^\/(internal\/)?(isAlive|isReady)\/?$/, (_req, res) =>
  res.sendStatus(200)
);

app.get('*', indexHandler);

console.log('server listening on port', environment().port);

app.listen(environment().port);
