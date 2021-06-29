export default function () {
  if (process.env.ENV === 'prod') {
    return {
      loginService: 'https://loginservice.nav.no/login?',
      apiUrl: 'https://www.nav.no/familie/alene-med-barn/soknad-api',
      dekoratørUrl: 'https://www.nav.no/dekoratoren/?simple=true',
      port: 9000,
    };
  } else if (process.env.ENV === 'dev') {
    return {
      loginService: 'https://loginservice.dev.nav.no/login?',
      apiUrl: 'https://www-q0.nav.no/familie/alene-med-barn/soknad-api',
      dekoratørUrl: 'https://www.nav.no/dekoratoren/?simple=true',
      port: 9000,
    };
  } else {
    return {
      loginService: 'https://loginservice.dev.nav.no/login?',
      apiUrl: 'http://localhost:8091',
      dekoratørUrl: 'https://www.nav.no/dekoratoren/?simple=true',
      port: 3000,
    };
  }
}
