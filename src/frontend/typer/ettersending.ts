import { IDokumentasjonsbehovWrapper } from './dokumentasjonsbehov';
import { DokumentType, StønadType } from './stønad';

export interface ISøknadsbehov {
  dokumentasjonsbehov: IDokumentasjonsbehovWrapper;
  søknadDato: any;
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
  id: string; // genenrer UUID ved mapping fra backend til nytt objekt
  søknadsdata?: ISøknadMetadata;
  dokumenttype?: string;
  stønadType?: StønadType;
  beskrivelse?: string;
  innsendingstidspunkt: any;
  vedlegg: IVedleggForEttersending[];
  erSammenslått?: boolean; // Settes kun internt for å vise info i frontend
}

export interface ISøknadMetadata {
  søknadId: string;
  søknadsdato: any;
  dokumentasjonsbehovId: string;
  harSendtInnTidligere: boolean;
}

export interface IVedleggForEttersending {
  id: string;
  navn: string;
  tittel: string;
}
