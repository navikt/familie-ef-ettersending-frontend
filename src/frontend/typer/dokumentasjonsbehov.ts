export interface IDokumentasjonsbehovListe {
  dokumentasjonsbehov: IDokumentasjonsbehov;
}

interface IDokumentasjonsbehov {
  id: string;
  label: string;
  harSendtInn: boolean;
  opplastedeVedlegg: Array<any>;
}
