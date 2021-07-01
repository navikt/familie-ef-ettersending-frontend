export interface IVedlegg {
  dokumentId: string;
  navn: string;
  størrelse: number;
  tidspunkt: string;
}

export interface IVedleggMedKrav {
  vedlegg: IVedlegg;
  kravId: string;
}
