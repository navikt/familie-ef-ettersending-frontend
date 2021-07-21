import {
  IDokumentasjonsbehov,
  IDokumentasjonsbehovWrapper,
} from './dokumentasjonsbehov';

export interface ISøknadsbehov {
  dokumentasjonsbehov: IDokumentasjonsbehovWrapper;
  søknadDato: any;
  stønadType: string;
  søknadId: string;
}

export interface IVedlegg {
  id: string;
  navn: string;
}

export interface IInnsending {
  beskrivelse: string;
  dokumenttype: string;
  vedlegg: IVedlegg;
}

export interface IEttersendingUtenSøknad {
  stønadstype: string;
  innsending: IInnsending[];
}
export interface IEttersendingForSøknad {
  søknadId: string;
  dokumentasjonsbehov: IDokumentasjonsbehov[];
  innsending: IInnsending[];
}

export interface IEttersending {
  fnr: string;
  ettersendingForSøknad: IEttersendingForSøknad | null;
  ettersendingUtenSøknad: IEttersendingUtenSøknad | null;
}

export const tomEttersendingUtenSøknad: IEttersendingUtenSøknad = {
  stønadstype: '',
  innsending: [
    {
      beskrivelse: '',
      dokumenttype: '',
      vedlegg: { id: '122', navn: '' },
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
