import { envVar } from './envVar';
import axios from 'axios';
import logger from './logger';

export class TexasClient {
  validateToken = async (identityProvider: string, token: string) => {
    const validateTokenUrl = envVar('NAIS_TOKEN_INTROSPECTION_ENDPOINT');

    const requestBody = {
      identity_provider: identityProvider,
      token: token,
    };

    try {
      const response = await axios.post(validateTokenUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        active: response.data.active,
      };
    } catch (error) {
      logger.error('Kunne ikke validere token mot Texas.', error);
      return {
        active: false,
      };
    }
  };

  exchangeToken = async (
    identityProvider: string,
    target: string,
    token: string,
  ) => {
    const exchangeTokenUrl = envVar('NAIS_TOKEN_EXCHANGE_ENDPOINT');

    const requestBody = {
      identity_provider: identityProvider,
      target: target,
      user_token: token,
    };

    try {
      const response = await axios.post(exchangeTokenUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      logger.info('Hentet ut token fra Texas', response.data);
      return {
        access_token: response.data.access_token,
        expires_in: response.data.expires_in,
        token_type: response.data.token_type,
      };
    } catch (error) {
      logger.error('Klarte ikke å bytte token mot Texas.', error);
      throw new Error('Token exchange failed');
    }
  };
}
