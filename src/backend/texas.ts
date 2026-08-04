import { envVar } from './envVar.js';
import logger from './logger.js';

export class TexasClient {
  private async postRequest(url: string, data: object) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    } catch (error) {
      logger.error(`Request mot ${url} feilet.`, error);
      throw error;
    }
  }

  async validateToken(identityProvider: string, token: string) {
    const validateTokenUrl = envVar('NAIS_TOKEN_INTROSPECTION_ENDPOINT');
    const requestBody = {
      identity_provider: identityProvider,
      token: token,
    };

    try {
      const data = await this.postRequest(validateTokenUrl, requestBody);
      return { active: data.active };
    } catch {
      return { active: false };
    }
  }

  async exchangeToken(identityProvider: string, target: string, token: string) {
    const exchangeTokenUrl = envVar('NAIS_TOKEN_EXCHANGE_ENDPOINT');
    const requestBody = {
      identity_provider: identityProvider,
      target: target,
      user_token: token,
    };

    try {
      const data = await this.postRequest(exchangeTokenUrl, requestBody);
      logger.info('Hentet ut token fra Texas', data);
      return {
        access_token: data.access_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
      };
    } catch (error) {
      logger.error('Klarte ikke å bytte token mot Texas.', error);
      throw new Error('Token exchange feilet');
    }
  }
}
