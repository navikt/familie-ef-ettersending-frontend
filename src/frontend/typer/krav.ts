export interface IKravliste {
  krav: IKrav;
}

interface IKrav {
  label: string;
  harSendtInn: boolean;
  opplastedeVedlegg: Array<any>;
}
