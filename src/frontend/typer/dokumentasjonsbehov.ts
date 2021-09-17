import { IVedleggForSøknad } from './ettersending';
export interface IDokumentasjonsbehovForSøknad {
  id: string;
  label: string;
  harSendtInn: boolean;
  opplastedeVedlegg: IVedleggForSøknad[];
}

export interface IDokumentasjonsbehovWrapper {
  dokumentasjonsbehov: IDokumentasjonsbehovForSøknad[];
}
