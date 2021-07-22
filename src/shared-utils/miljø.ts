export const kjørerLokalt = (): boolean =>
  typeof window !== 'undefined' &&
  window.location.hostname.indexOf('localhost') > -1;
