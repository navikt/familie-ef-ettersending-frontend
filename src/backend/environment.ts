const isProd = () => {
  if (typeof window === 'undefined') {
    return process.env.ENV === 'prod';
  }
  return window.location.hostname.indexOf('www') > -1;
};

const isDev = () => {
  if (typeof window === 'undefined') {
    return process.env.ENV === 'dev';
  }
  return window.location.hostname.indexOf('dev') > -1;
};

// Se på disse url-ene. Her lenker dev og env til hele lenken, mens den siste har bare port 8082 og sender med resten i api-service

export interface EnvironmentProps {
  wonderwallUrl: string;
  apiUrl: string;
  apiProxyUrl: string;
  dokumentProxyUrl: string;
  dokumentUrl: string;
  port: number;
  dekoratørEnv: 'dev' | 'prod';
  oauthCallbackUri: string;
}

const environment = (): EnvironmentProps => {
  if (isProd()) {
    return {
      wonderwallUrl:
        'https://www.nav.no/familie/alene-med-barn/ettersending/oauth2/login?redirect=',
      apiProxyUrl: 'https://www.nav.no/familie/alene-med-barn/ettersending/api',
      apiUrl: 'http://familie-ef-soknad-api/familie/alene-med-barn/soknad-api',
      dokumentProxyUrl:
        'https://www.nav.no/familie/alene-med-barn/ettersending/dokument',
      dokumentUrl: 'http://familie-dokument/familie/dokument',
      port: 9000,
      dekoratørEnv: 'prod',
      oauthCallbackUri:
        'https://www.nav.no/familie/alene-med-barn/ettersending/oauth2/callback',
    };
  } else if (isDev()) {
    return {
      wonderwallUrl:
        'https://familie.ekstern.dev.nav.no/familie/alene-med-barn/ettersending/oauth2/login?redirect=',
      apiProxyUrl:
        'https://familie.ekstern.dev.nav.no/familie/alene-med-barn/ettersending/api',
      apiUrl: 'http://familie-ef-soknad-api/familie/alene-med-barn/soknad-api',
      dokumentProxyUrl:
        'https://familie.ekstern.dev.nav.no/familie/alene-med-barn/ettersending/dokument',
      dokumentUrl: 'http://familie-dokument/familie/dokument',
      port: 9000,
      dekoratørEnv: 'dev',
      oauthCallbackUri:
        'https://familie.ekstern.dev.nav.no/familie/alene-med-barn/ettersending/oauth2/callback',
    };
  } else {
    return {
      wonderwallUrl:
        'http://localhost:8091/local/cookie?issuerId=tokenx&audience=familie-app&subject=21057822284&redirect=',
      apiUrl: 'http://localhost:8091',
      apiProxyUrl: 'http://localhost:8091',
      dokumentProxyUrl: 'http://localhost:8082/familie/dokument',
      dokumentUrl: 'http://localhost:8082/familie/dokument',
      port: 3000,
      dekoratørEnv: 'dev',
      oauthCallbackUri:
        'https://localhost:8080/familie/alene-med-barn/ettersending/oauth2/callback',
    };
  }
};

export const isLocal = () => !isProd() && !isDev();
export default environment;
