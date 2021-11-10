import { IDokumentasjonsbehov, IEttersending } from '../typer/ettersending';

export const minstEttVedleggErLastetOpp = (
  dokumentasjonsbehov: IDokumentasjonsbehov[]
): boolean => {
  return dokumentasjonsbehov.some(
    (innsending) => innsending.vedlegg.length > 0
  );
};

export const minstEnBoksErAvkrysset = (
  dokumentasjonsbehov: IDokumentasjonsbehov[]
): boolean => {
  return dokumentasjonsbehov.some(
    (innsending) => innsending.søknadsdata?.harSendtInnTidligere
  );
};

export const minstEttVedleggErLastetOppForEkstraDokumentasjonsboks = (
  dokumentasjonsbehov: IDokumentasjonsbehov[],
  ekstraInnsendingerId: string[]
): boolean => {
  return (
    ekstraInnsendingerId.length === 0 ||
    dokumentasjonsbehov
      .filter((innsending) => ekstraInnsendingerId.includes(innsending.id))
      .some((innsending) => innsending.vedlegg.length > 0)
  );
};

export const ekstraInnsendingerUtenVedlegg = (
  dokumentasjonsbehov: IDokumentasjonsbehov[],
  ekstraInnsendingerId: string[]
): string[] => {
  const innsendingerUtenVedlegg: string[] = [];
  dokumentasjonsbehov.forEach((innsending) => {
    ekstraInnsendingerId.includes(innsending.id) &&
      innsending.vedlegg.length === 0 &&
      innsendingerUtenVedlegg.push(innsending.id);
  });
  return innsendingerUtenVedlegg;
};

export const filtrerUtfylteInnsendinger = (
  ettersending: IEttersending
): IDokumentasjonsbehov[] => {
  return ettersending.dokumentasjonsbehov.filter(
    (innsending) =>
      innsending.vedlegg.length > 0 ||
      innsending.søknadsdata?.harSendtInnTidligere
  );
};
