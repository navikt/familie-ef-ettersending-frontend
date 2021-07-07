export interface IDokumentasjonsbehovListe {
  dokumentasjonsbehov: Array<IDokumentasjonsbehov>;
}

export interface IDokumentasjonsbehov {
  id: string;
  label: string;
  harSendtInn: boolean;
  opplastedeVedlegg: Array<any>;
}
