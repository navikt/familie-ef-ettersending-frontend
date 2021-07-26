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

const getEnv = () => {
  if (isProd()) {
    return {
      loginService: 'https://loginservice.nav.no/login?',
      apiUrl: 'https://www.nav.no/familie/alene-med-barn/soknad-api',
      dekoratørUrl: 'https://www.nav.no/dekoratoren/?simple=true',
      dokumentUrl:
        'https://www.nav.no/familie/dokument/api/mapper/familievedlegg',
      port: 9000,
    };
  } else if (isDev()) {
    return {
      loginService: 'https://loginservice.dev.nav.no/login?',
      apiUrl:
        'https://familie-ef-soknad-api.dev.nav.no/familie/alene-med-barn/soknad-api',
      dekoratørUrl: 'https://dekoratoren.dev.nav.no/',
      dokumentUrl:
        'https://familie-dokument.dev.nav.no/familie/dokument/api/mapper/familievedlegg',
      port: 9000,
    };
  } else {
    return {
      loginService: 'https://loginservice.dev.nav.no/login?',
      apiUrl: 'http://localhost:8091',
      dekoratørUrl: 'https://www.nav.no/dekoratoren/?simple=true',
      dokumentUrl:
        'http://localhost:8082/familie/dokument/api/mapper/familievedlegg/',
      port: 3000,
    };
  }
};

export default getEnv;
