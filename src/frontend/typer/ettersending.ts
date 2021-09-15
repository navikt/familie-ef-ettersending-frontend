import { IDokumentasjonsbehovWrapper } from './dokumentasjonsbehov';
import { DokumentType, StønadType } from './stønad';

export interface ISøknadsbehov {
  dokumentasjonsbehov: IDokumentasjonsbehovWrapper;
  søknadDato: any;
  stønadType: StønadType;
  søknadId: string;
}

export interface IVedlegg {
  id: string;
  navn: string;
  dato?: string;
  beskrivelse?: string;
  dokumenttype?: DokumentType;
  stønadstype?: StønadType;
}

export interface IEttersending {
  dokumentasjonsbehov: IDokumentasjonsbehovTilBackend[];
  personIdent: string;
}

export interface IDokumentasjonsbehovTilBackend {
  id: string; // genenrer UUID ved mapping fra backend til nytt objekt
  søknadsdata?: ISøknadMetadata;
  dokumenttype?: string;
  stønadType?: StønadType;
  beskrivelse?: string;
  innsendingstidspunkt: any;
  vedlegg: IVedleggX[];
}

export interface ISøknadMetadata {
  søknadId: string;
  søknadsdato: any;
  dokumentasjonsbehovId: string;
  harSendtInnTidligere: boolean;
}

export interface IVedleggX {
  id: string;
  navn: string;
  tittel: string;
}
