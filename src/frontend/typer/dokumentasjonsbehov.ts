import { IVedlegg } from './ettersending';
export interface IDokumentasjonsbehov {
  id: string;
  label: string;
  harSendtInn: boolean;
  opplastedeVedlegg: Array<IVedlegg>;
}

export interface IDokumentasjonsbehovWrapper {
  dokumentasjonsbehov: Array<IDokumentasjonsbehov>;
}
