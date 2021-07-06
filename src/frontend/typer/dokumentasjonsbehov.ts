export interface IDokumentasjonsbehovListe {
  krav: IDokumentasjonsbehov;
}

interface IDokumentasjonsbehov {
  id: string;
  label: string;
  harSendtInn: boolean;
  opplastedeVedlegg: Array<any>;
}
