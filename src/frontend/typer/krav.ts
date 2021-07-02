export interface IKravliste {
  krav: IKrav;
}

interface IKrav {
  id: string;
  label: string;
  harSendtInn: boolean;
  opplastedeVedlegg: Array<any>;
}
