import { NextFunction, Request, RequestHandler, Response } from 'express';
import logger, { logInfo } from './logger';
import { isLocal } from './environment';
import { TexasClient } from './texas';

export type ApplicationName = 'familie-ef-soknad-api' | 'familie-dokument';

const AUTHORIZATION_HEADER = 'authorization';
const WONDERWALL_ID_TOKEN_HEADER = 'x-wonderwall-id-token';

const attachToken = (applicationName: ApplicationName): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const audience = `dev-gcp:teamfamilie:${applicationName}`;

    try {
      req.headers[AUTHORIZATION_HEADER] = isLocal()
        ? await getFakedingsToken(audience)
        : await getAccessToken(req, audience);

      req.headers[WONDERWALL_ID_TOKEN_HEADER] = '';
      next();
    } catch (error) {
      logger.error(
        `Noe gikk galt ved setting av token (${req.method} - ${req.path})) - ${error}`,
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

const getAccessToken = async (req: Request, audience: string) => {
  logInfo('getAccessToken', req);
  const { authorization } = req.headers;
  const token = utledToken(req, authorization);

  const texasClient = new TexasClient();

  const accessToken = await texasClient
    .exchangeToken('tokenx', audience, token)
    .then((accessToken) => {
      return accessToken.access_token;
    });

  return `Bearer ${accessToken}`;
};

const getFakedingsToken = async (audience: string) => {
  const clientId = 'dev-gcp:teamfamilie:familie-ef-ettersending';

  const url = `https://fakedings.intern.dev.nav.no/fake/tokenx?client_id=${clientId}&aud=${audience}&acr=Level4&pid=31458931375`;
  const token = await fetch(url).then(function (body) {
    return body.text();
  });

  return `Bearer ${token}`;
};

export default attachToken;
