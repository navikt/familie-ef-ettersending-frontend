export const RessursStatus = {
  FEILET: 'FEILET',
  HENTER: 'HENTER',
  IKKE_HENTET: 'IKKE_HENTET',
  IKKE_TILGANG: 'IKKE_TILGANG',
  SUKSESS: 'SUKSESS',
  FUNKSJONELL_FEIL: 'FUNKSJONELL_FEIL',
} as const;

export type RessursStatus = (typeof RessursStatus)[keyof typeof RessursStatus];

export type RessursSuksess<T> = {
  data: T;
  status: typeof RessursStatus.SUKSESS;
};

export type RessursLaster = {
  status: typeof RessursStatus.HENTER;
};

export type FeilMelding = {
  errorMelding?: string;
  melding: string;
  frontendFeilmelding: string;
  frontendFeilmeldingUtenFeilkode?: string;
};

export type RessursFeilet =
  | (FeilMelding & { status: typeof RessursStatus.IKKE_TILGANG })
  | (FeilMelding & { status: typeof RessursStatus.FEILET })
  | (FeilMelding & { status: typeof RessursStatus.FUNKSJONELL_FEIL });

export type Ressurs<T> =
  | { status: typeof RessursStatus.IKKE_HENTET }
  | RessursLaster
  | RessursSuksess<T>
  | RessursFeilet;
