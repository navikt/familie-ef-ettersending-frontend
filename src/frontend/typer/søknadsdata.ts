export interface IVedlegg {
  id: string;
  navn: string;
  størrelse: number;
  tidspunkt: string;
}

export interface IVedleggMedKrav {
  vedlegg: IVedlegg;
  kravId: string;
}

export interface IHarSendtInnMedKrav {
  harSendtInn: boolean;
  kravId: string;
}
