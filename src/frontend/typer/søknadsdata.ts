import { IDokumentasjonsbehov } from './dokumentasjonsbehov';

export interface ISøknadsbehov {
  dokumentasjonsbehov: Array<IDokumentasjonsbehov>;
  innsendingstidspunkt: any;
  personIdent: string;
  søknadType: string;
}

export interface IVedlegg {
  id: string;
  navn: string;
  størrelse: number;
  tidspunkt: string;
}
