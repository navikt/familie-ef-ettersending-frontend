import { NextFunction, Request, RequestHandler, Response } from 'express';
import TokenXClient from './tokenx';
import logger, { logInfo } from './logger';
import { isLocal } from './environment';

const { exchangeToken } = new TokenXClient();

export type ApplicationName = 'familie-ef-soknad-api' | 'familie-dokument';

const AUTHORIZATION_HEADER = 'authorization';
const WONDERWALL_ID_TOKEN_HEADER = 'x-wonderwall-id-token';

const attachToken = (applicationName: ApplicationName): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    req.headers[AUTHORIZATION_HEADER] = isLocal()
      ? await getFakedingsToken(applicationName)
      : await getAccessToken(req);
    // : await getAccessToken(req, applicationName);

    req.headers[WONDERWALL_ID_TOKEN_HEADER] = '';
    next();
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

const getAccessToken = async (req: Request) => {
  logInfo('getAccessToken', req);
  const { authorization } = req.headers;
  const token = utledToken(req, authorization);

  logger.info(`IdPorten-token ${JSON.stringify(token)}`);

  const accessToken = await exchangeToken(
    token,
    'tokenx',
    'dev-gcp:teamfamilie:familie-ef-soknad-api',
  ).then(
    // const accessToken = await exchangeToken(token, applicationName).then(
    (accessToken) => accessToken,
  );

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
