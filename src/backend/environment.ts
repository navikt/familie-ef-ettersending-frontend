//TODO: Updated these
export default function () {
  if (process.env.ENV === 'prod') {
    return {
      apiUrl: 'https://www.nav.no/familie/alene-med-barn/soknad-api',
      dekoratørUrl: 'https://www.nav.no/dekoratoren/?simple=true',
      port: 9000,
    };
  } else if (process.env.ENV === 'dev') {
    return {
      apiUrl: 'https://www.nav.no/familie/alene-med-barn/soknad-api', //Må opppdateres
      dekoratørUrl: 'https://www.nav.no/dekoratoren/?simple=true',
      //dekoratørUrl: 'https://www-q1.nav.no/dekoratoren/?simple=true',
      port: 9000,
    };
  } else {
    console.log('YWY');
    return {
      apiUrl: 'https://www.nav.no/familie/alene-med-barn/soknad-api',
      dekoratørUrl: 'https://www.nav.no/dekoratoren/?simple=true',
      port: 3000,
    };
  }
}
