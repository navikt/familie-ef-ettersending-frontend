/* eslint-disable @typescript-eslint/no-explicit-any */
import { Issuer } from 'openid-client';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import nodeJose from 'node-jose';
import logger, { logInfo } from './logger';
// import { ApplicationName } from './tokenProxy';
import environment, { isLocal } from './environment';
import { envVar } from './envVar';
import axios from 'axios';

class TokenXClient {
  private tokenxClient: any = null;
  private audience: any = null;

  constructor() {
    logger.info('Setter opp TokenX');
    if (isLocal()) {
      logger.info('Setter ikke opp TokenX lokalt');
      return;
    }
    this.init()

      .then((client: any) => {
        this.tokenxClient = client;
      })
      .catch(() => process.exit(1));
  }

  validateTokenByTexas = async (
    idportenToken: any,
    identityProvider: string,
  ) => {
    const valideTokenUrl = envVar('NAIS_TOKEN_INTROSPECTION_ENDPOINT');

    logger.info('Validerer token med identity provider:' + identityProvider);

    const requestBody = JSON.stringify({
      identity_provider: identityProvider,
      token: idportenToken,
    });

    if (!valideTokenUrl || valideTokenUrl.length <= 0) {
      logger.error('Validerings-URL er tom eller udefinert');
      return;
    }

    try {
      const response = await axios.post(valideTokenUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      logger.info('Fikk kontakt med Texas!', response.data);

      if (response.data.active) {
        logger.info('Token er gyldig');
      } else {
        logger.warn('Token er ugyldig: ', response.data.error);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          logger.error(
            `Feil validering av innlogging. Statuskode ${error.response.status}, body ${error.response.data}`,
            error,
          );
          return false;
        }
      } else {
        logger.error('Feil ved validering av innlogging', error);
      }
      throw error;
    }
  };

  exchangeToken = async (idportenToken: any) => {
    const url = envVar('NAIS_TOKEN_EXCHANGE_ENDPOINT');

    const body = JSON.stringify({
      identity_provider: 'azuread',
      target: 'api://dev-gcp.teamfamilie.familie-ef-ettersending/.default',
      user_token: idportenToken,
    });

    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    logger.info(`Start exchangeToken - body: ${body}`);

    // const response = await axios.post(url, body, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });

    logger.info(`exchangeToken ${JSON.stringify(response)}`);
    return response;
  };

  generateToken = async () => {
    const url = process.env['NAIS_TOKEN_ENDPOINT'];
    const data = {
      identity_provider: 'azuread',
      target: 'api://dev-gcp.teamfamilie.familie-ef-ettersending/.default',
    };

    logger.info(`Start generateToken - data: ${data}`);
    const response = axios
      .post(`${url}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        logInfo('generateToken', res.data);
        return res.data;
      });

    return response;
    // return this.tokenxClient
    //   .grant({
    //     grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
    //     client_assertion_type:
    //       'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    //     token_endpoint_auth_method: 'private_key_jwt',
    //     client_assertion: clientAssertion,
    //     subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    //     subject_token: idportenToken,
    //     audience: `${tokenxConfig.clusterName}:teamfamilie:${applicationName}`,
    //   })
    //   .then((tokenSet: any) => {
    //     return Promise.resolve(tokenSet.access_token);
    //   })
    //   .catch((err: any) => {
    //     logger.error('Feil under utveksling av token: ', err);
    //     return Promise.reject(err);
    //   });
  };

  private createClientAssertion = async () => {
    const now = Math.floor(Date.now() / 1000);

    const payload = {
      sub: tokenxConfig.clientId,
      iss: tokenxConfig.clientId,
      aud: this.audience,
      jti: uuid(),
      nbf: now,
      iat: now,
      exp: now + 60, // max 120
    };

    const key = await this.asKey(tokenxConfig.privateJwk);

    const options: any = {
      algorithm: 'RS256',
      header: {
        kid: key.kid,
        typ: 'JWT',
        alg: 'RS256',
      },
    };

    return jwt.sign(payload, key.toPEM(true), options);
  };

  private asKey = async (jwk: any) => {
    if (!jwk) {
      logger.error('JWK Mangler');
      throw Error('JWK Mangler');
    }

    return nodeJose.JWK.asKey(jwk).then((key: any) => {
      return Promise.resolve(key);
    });
  };

  private init = async () => {
    if (!tokenxConfig.discoveryUrl) {
      logger.error('Mangler miljøvariabel TOKEN_X_WELL_KNOWN_URL');
      throw new TypeError(
        'Miljøvariabelen "TOKEN_X_WELL_KNOWN_URL må være satt',
      );
    }
    const tokenx = await Issuer.discover(tokenxConfig.discoveryUrl);
    this.audience = tokenx.token_endpoint;

    logger.info(`Discovered TokenX @ ${tokenx.issuer}`);

    try {
      const client = new tokenx.Client({
        client_id: tokenxConfig.clientId as string,
        redirect_uris: [tokenxConfig.redirectUri],
        token_endpoint_auth_method: 'none',
      });

      logger.info('Opprettet TokenX client');

      return Promise.resolve(client);
    } catch (err) {
      logger.error(
        'Feil oppstod under parsing av jwt eller opprettelse av TokenX client',
        err,
      );
      return Promise.reject(err);
    }
  };
}

const tokenxConfig = {
  discoveryUrl: process.env.TOKEN_X_WELL_KNOWN_URL,
  clientId: process.env.TOKEN_X_CLIENT_ID,
  privateJwk: process.env.TOKEN_X_PRIVATE_JWK,
  redirectUri: environment().oauthCallbackUri,
  clusterName: process.env.NAIS_CLUSTER_NAME,
};

export default TokenXClient;
