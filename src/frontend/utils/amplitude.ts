import amplitude from 'amplitude-js';

const amplitudeInstance = amplitude.getInstance();

amplitudeInstance.init('default', '', {
  apiEndpoint: 'amplitude.nav.no/collect-auto',
  saveEvents: false,
  includeUtm: true,
  includeReferrer: true,
  platform: window.location.toString(),
});

export function logEvent(eventName: string, eventProperties: any) {
  amplitudeInstance.logEvent(eventName, eventProperties);
}

export const logFeilFilopplasting = (...props: any) => {
  logEvent('filopplasting_feilet', {
    applikasjon: 'familie-ef-ettersending',
    ...props,
  });
};

export const logDokumentasjonsbehov = (dokBehov: any, ...props: any) => {
  dokBehov.map((dok: any) => {
    logEvent('dokumentasjonsbehov_ettersending', {
      applikasjon: 'familie-ef-ettersending',
      team_id: 'familie',
      dokumentBeskrivelse: dok.beskrivelse,
      dokumenttype: dok.dokumenttype,
      stønadType: dok.stønadType,
      ...props,
    });
  });
};

export const logSidevisning = (side: string) => {
  logEvent('besøk', {
    side,
    team_id: 'familie',
    applikasjon: 'familie-ef-ettersending',
  });
};
