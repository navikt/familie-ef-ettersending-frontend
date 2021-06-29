const getEnv = () => {
  if (process.env.ENV === 'prod') {
    console.log('Miljø -> Prod');
    return {
      loginService: 'https://loginservice.nav.no/login?',
      apiUrl: 'https://www.nav.no/familie/alene-med-barn/soknad-api',
      dekoratørUrl: 'https://www.nav.no/dekoratoren/?simple=true',
      port: 9000,
    };
  } else if (process.env.ENV === 'dev') {
    console.log('Miljø -> Dev');
    return {
      loginService: 'https://loginservice.dev.nav.no/login?',
      apiUrl: 'https://www-q0.nav.no/familie/alene-med-barn/soknad-api',
      dekoratørUrl: 'https://www.nav.no/dekoratoren/?simple=true',
      port: 9000,
    };
  } else {
    console.log('Miljø -> Prod or dev not defined');
    return {
      loginService: 'https://loginservice.dev.nav.no/login?',
      apiUrl: 'http://localhost:8091',
      dekoratørUrl: 'https://www.nav.no/dekoratoren/?simple=true',
      port: 3000,
    };
  }
};

export default getEnv;
