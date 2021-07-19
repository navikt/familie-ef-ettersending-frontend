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
  størrelse: number;
  tidspunkt: string;
}

export interface IÅpenEttersending {
  beskrivelse: string;
  dokumenttype: string;
  vedlegg: IVedlegg[];
}

export interface IÅpenEttersendingMedStønadstype {
  stønadstype: string;
  åpenEttersending: IÅpenEttersending;
}
