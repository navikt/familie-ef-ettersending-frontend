const getEnv = () => {
  if (process.env.NODE_ENV === 'prod') {
    return {
      innloggingUrl:
        'https://nav.no/familie/barnetrygd/soknad/ordinaer/api/innlogget',
      apiUrl: 'https://www.nav.no/familie/alene-med-barn/soknad-api',
      dekoratørUrl: 'https://www.nav.no/dekoratoren/?simple=true',
      port: 9000,
    };
  } else if (process.env.NODE_ENV === 'dev') {
    return {
      innloggingUrl:
        'https://familie-ba-soknad.dev.nav.no/familie/barnetrygd/soknad/ordinaer/api/innlogget',
      apiUrl: 'https://www.nav.no/familie/alene-med-barn/soknad-api', //Må opppdateres
      dekoratørUrl: 'https://www.nav.no/dekoratoren/?simple=true',
      port: 9000,
    };
  } else {
    return {
      innlogginUrl: 'http://localhost:8091/api/innlogget',
      apiUrl: 'https://www.nav.no/familie/alene-med-barn/soknad-api',
      dekoratørUrl: 'https://www.nav.no/dekoratoren/?simple=true',
      port: 3000,
    };
  }
};

export default getEnv;
