import {
  IDokumentasjonsbehov,
  IDokumentasjonsbehovWrapper,
} from './dokumentasjonsbehov';
import { DokumentType, StønadType } from './stønad';

export interface ISøknadsbehov {
  dokumentasjonsbehov: IDokumentasjonsbehovWrapper;
  søknadDato: any;
  stønadType: StønadType;
  søknadId: string;
}

export interface ISøknadMedEttersendinger {
  dokumentasjonsbehov: IDokumentasjonsbehov[];
  søknadDato: any;
  stønadType: StønadType;
  søknadId: string;
  innsending: IInnsending[];
}

export interface IVedlegg {
  id: string;
  navn: string;
  dato?: string;
  beskrivelse?: string;
  dokumenttype?: DokumentType;
  stønadstype?: StønadType;
}

export interface IInnsending {
  beskrivelse: string;
  dokumenttype?: DokumentType;
  vedlegg: IVedlegg | null;
}

export interface IEttersendingUtenSøknad {
  innsending: IInnsending[];
}
export interface IEttersendingForSøknad {
  søknadId: string;
  dokumentasjonsbehov: IDokumentasjonsbehov[];
  innsending: IInnsending[];
}

export interface IEttersending {
  fnr: string;
  stønadType: StønadType;
  ettersendingForSøknad: IEttersendingForSøknad | null;
  ettersendingUtenSøknad: IEttersendingUtenSøknad | null;
}

export interface IEttersendingMedDato {
  ettersendingDto: IEttersending;
  mottattTidspunkt: string;
}

export const tomEttersendingUtenSøknad: IEttersendingUtenSøknad = {
  innsending: [
    {
      beskrivelse: '',
      dokumenttype: undefined,
      vedlegg: null,
    },
  ],
};

export const tomEttersendingForSøknad: IEttersendingForSøknad = {
  søknadId: '',
  dokumentasjonsbehov: [],
  innsending: [],
};

export const tomInnsending: IInnsending = {
  beskrivelse: '',
  dokumenttype: undefined,
  vedlegg: null,
};

export enum EttersendingType {
  ETTERSENDING_UTEN_SØKNAD,
  ETTERSENDING_MED_SØKNAD_DOKUMENTASJONSBEHOV,
  ETTERSENDING_MED_SØKNAD_INNSENDING,
}
