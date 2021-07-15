import { IVedlegg } from './søknadsdata';

//TODO: denne kan fjernes og byttes med ISøknadsbehov
export interface IDokumentasjonsbehovListe {
  dokumentasjonsbehov: Array<IDokumentasjonsbehov>;
}

export interface IDokumentasjonsbehov {
  id: string;
  label: string;
  harSendtInn: boolean;
  opplastedeVedlegg: Array<IVedlegg>;
}
