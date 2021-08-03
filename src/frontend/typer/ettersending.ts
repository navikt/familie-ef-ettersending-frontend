import {
  IDokumentasjonsbehov,
  IDokumentasjonsbehovWrapper,
} from './dokumentasjonsbehov';
import { StønadType } from './stønad';

export interface ISøknadsbehov {
  dokumentasjonsbehov: IDokumentasjonsbehovWrapper;
  søknadDato: any;
  stønadType: string;
  søknadId: string;
}

export interface ISøknadMedEttersendinger {
  dokumentasjonsbehov: IDokumentasjonsbehov[];
  søknadDato: any;
  stønadType: string;
  søknadId: string;
  innsending: IInnsending[];
}

export interface IVedlegg {
  id: string;
  navn: string;
  dato?: string;
  beskrivelse?: string;
  dokumenttype?: string;
  stønadstype?: string;
}

export interface IInnsending {
  beskrivelse: string;
  dokumenttype: string;
  vedlegg: IVedlegg | null;
}

export interface IEttersendingUtenSøknad {
  stønadstype: string;
  innsending: IInnsending[];
}

export interface IEttersendingUtenSøknadTilInnsending {
  stønadstype: string | null;
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

export interface IEttersendingTilInnsending {
  fnr: string;
  stønadType: StønadType;
  ettersendingForSøknad: IEttersendingForSøknad | null;
  ettersendingUtenSøknad: IEttersendingUtenSøknadTilInnsending | null;
}

export const tomEttersendingUtenSøknad: IEttersendingUtenSøknad = {
  stønadstype: '',
  innsending: [
    {
      beskrivelse: '',
      dokumenttype: '',
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
  dokumenttype: '',
  vedlegg: null,
};

export enum EttersendingType {
  ETTERSENDING_UTEN_SØKNAD,
  ETTERSENDING_MED_SØKNAD_DOKUMENTASJONSBEHOV,
  ETTERSENDING_MED_SØKNAD_INNSENDING,
}
