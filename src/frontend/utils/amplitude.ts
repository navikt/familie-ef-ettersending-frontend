import amplitude from 'amplitude-js';
import { IDokumentasjonsbehov } from '../typer/ettersending';

const amplitudeInstance = amplitude.getInstance();

amplitudeInstance.init('default', '', {
  apiEndpoint: 'amplitude.nav.no/collect-auto',
  saveEvents: false,
  includeUtm: true,
  includeReferrer: true,
  platform: window.location.toString(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logEvent(eventName: string, eventProperties: any) {
  amplitudeInstance.logEvent(eventName, eventProperties);
}

export interface FeilOpplastingProps {
  type_feil: string;
  feilmelding: string;
  filtype?: string;
  filstørrelse?: number;
}

export const logFeilFilopplasting = (props: FeilOpplastingProps) => {
  logEvent('filopplasting_feilet', {
    applikasjon: 'familie-ef-ettersending',
    ...props,
  });
};

export const logDokumentasjonsbehov = (dokBehov: IDokumentasjonsbehov[]) => {
  dokBehov.map((dok: IDokumentasjonsbehov) => {
    logEvent('dokumentasjonsbehov_ettersending', {
      applikasjon: 'familie-ef-ettersending',
      team_id: 'familie',
      dokumentBeskrivelse: dok.beskrivelse,
      dokumenttype: dok.dokumenttype,
      stønadType: dok.stønadType,
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
