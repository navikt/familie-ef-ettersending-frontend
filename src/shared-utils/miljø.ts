export const kjørerLokalt = (): boolean =>
  typeof window !== 'undefined' &&
  window.location.hostname.indexOf('www') === -1 &&
  window.location.hostname.indexOf('dev') === -1;
