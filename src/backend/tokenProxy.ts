import { NextFunction, Request, RequestHandler, Response } from 'express';
import TokenXClient from './tokenx';
import logger, { logWarn, logInfo } from './logger';
import { isLocal } from './environment';

const { exchangeToken, generateToken, validateTokenByTexas } =
  new TokenXClient();

export type ApplicationName = 'familie-ef-soknad-api' | 'familie-dokument';

const AUTHORIZATION_HEADER = 'authorization';
const WONDERWALL_ID_TOKEN_HEADER = 'x-wonderwall-id-token';

const attachToken = (applicationName: ApplicationName): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.headers[AUTHORIZATION_HEADER] = isLocal()
        ? await getFakedingsToken(applicationName)
        : await getAccessToken(req);
      // : await getAccessToken(req, applicationName);

      req.headers[WONDERWALL_ID_TOKEN_HEADER] = '';
      next();
    } catch (error) {
      logWarn(
        `Noe gikk galt ved setting av token (${req.method} - ${req.path}): `,
        req,
        error,
      );
      return res
        .status(401)
        .send('En uventet feil oppstod. Ingen gyldig token');
    }
  };
};

const harBearerToken = (authorization: string) => {
  return authorization.includes('Bearer ');
};

const utledToken = (req: Request, authorization: string | undefined) => {
  if (authorization && harBearerToken(authorization)) {
    return authorization.split(' ')[1];
  } else {
    throw Error('Mangler authorization i header');
  }
};

const getAccessToken = async (
  req: Request,
  // applicationName: ApplicationName,
) => {
  logInfo('getAccessToken', req);
  const { authorization } = req.headers;
  const token = utledToken(req, authorization);
  logger.info(`IdPorten-token ${JSON.stringify(token)}`);

  validateTokenByTexas(token);

  const accessToken = await exchangeToken(token).then(
    // const accessToken = await exchangeToken(token, applicationName).then(
    (accessToken) => accessToken,
  );
  generateToken();
  return `Bearer ${accessToken}`;
};

const getFakedingsToken = async (applicationName: string) => {
  const clientId = 'dev-gcp:teamfamilie:familie-ef-ettersending';
  const audience = `dev-gcp:teamfamilie:${applicationName}`;

  const url = `https://fakedings.intern.dev.nav.no/fake/tokenx?client_id=${clientId}&aud=${audience}&acr=Level4&pid=31458931375`;
  const token = await fetch(url).then(function (body) {
    return body.text();
  });

  return `Bearer ${token}`;
};

export default attachToken;
