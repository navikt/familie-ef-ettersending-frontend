import { IVedlegg } from './ettersending';
export interface IDokumentasjonsbehovFraBackend {
  id: string;
  label: string;
  harSendtInn: boolean;
  opplastedeVedlegg: IVedlegg[];
}

export interface IDokumentasjonsbehovWrapper {
  dokumentasjonsbehov: IDokumentasjonsbehovFraBackend[];
}
