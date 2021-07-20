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
  ettersendingForSøknad: IEttersendingForSøknad;
  ettersendingUtenSøknad: IEttersendingUtenSøknad;
}
