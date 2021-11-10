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

export const formaterFilstørrelse = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
