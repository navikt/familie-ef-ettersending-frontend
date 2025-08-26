import type { IDokumentasjonsbehovWrapper } from './dokumentasjonsbehov';
import { DokumentType, StønadType } from './stønad';

export interface ISøknadsbehov {
  dokumentasjonsbehov: IDokumentasjonsbehovWrapper;
  søknadDato: string;
  stønadType: StønadType;
  søknadId: string;
}

export interface IVedleggForSøknad {
  id: string;
  navn: string;
  dato?: string;
  beskrivelse?: string;
  dokumenttype?: DokumentType;
  stønadstype?: StønadType;
}

export interface IEttersending {
  dokumentasjonsbehov: IDokumentasjonsbehov[];
  personIdent: string;
}

export interface IDokumentasjonsbehov {
  id: string;
  søknadsdata?: ISøknadMetadata;
  dokumenttype?: string;
  stønadType?: StønadType;
  beskrivelse?: string;
  innsendingstidspunkt: string;
  vedlegg: IVedleggForEttersending[];
  erSammenslått?: boolean; // Settes kun internt for å vise info i frontend
}

export interface ISøknadMetadata {
  søknadId: string;
  søknadsdato: string;
  dokumentasjonsbehovId: string;
  harSendtInnTidligere: boolean;
}

export interface IVedleggForEttersending {
  id: string;
  navn: string;
  tittel: string;
}
