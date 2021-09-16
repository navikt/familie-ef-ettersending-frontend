import { IDokumentasjonsbehovTilBackend } from '../typer/ettersending';

export const minstEttVedleggErLastetOpp = (
  dokumentasjonsbehov: IDokumentasjonsbehovTilBackend[]
): boolean => {
  return dokumentasjonsbehov.some(
    (innsending) => innsending.vedlegg.length > 0
  );
};

export const minstEnBoksErAvkrysset = (
  dokumentasjonsbehov: IDokumentasjonsbehovTilBackend[]
): boolean => {
  return dokumentasjonsbehov.some(
    (innsending) => innsending.søknadsdata?.harSendtInnTidligere
  );
};

export const minstEttVedleggErLastetOppForEkstraDokumentasjonsboks = (
  dokumentasjonsbehov: IDokumentasjonsbehovTilBackend[],
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
  dokumentasjonsbehov: IDokumentasjonsbehovTilBackend[],
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
