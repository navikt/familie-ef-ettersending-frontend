import {
  IEttersending,
  ISøknadsbehov,
  IVedleggForEttersending,
} from '../typer/ettersending';
import { IDokumentasjonsbehovForSøknad } from '../typer/dokumentasjonsbehov';

export const slåSammenSøknadOgEttersendinger = (
  søknad: ISøknadsbehov,
  ettersendinger: IEttersending[]
): ISøknadsbehov => {
  const dokumentasjonsbehov: IDokumentasjonsbehovForSøknad[] =
    søknad.dokumentasjonsbehov.dokumentasjonsbehov.map((behov) => {
      let ettersendteVedlegg: IVedleggForEttersending[] =
        behov.opplastedeVedlegg.map((vedlegg) => ({
          ...vedlegg,
          tittel: 'ingen tittel',
        }));
      let harSendtInnPåAnnenMåte = behov.harSendtInn;
      ettersendinger.forEach((ettersending) => {
        ettersending.dokumentasjonsbehov.forEach((dokumentasjonsbehov) => {
          if (
            dokumentasjonsbehov.søknadsdata &&
            dokumentasjonsbehov.søknadsdata.søknadId === søknad.søknadId &&
            dokumentasjonsbehov.søknadsdata.dokumentasjonsbehovId === behov.id
          ) {
            ettersendteVedlegg = [
              ...ettersendteVedlegg,
              ...dokumentasjonsbehov.vedlegg,
            ];
            harSendtInnPåAnnenMåte = dokumentasjonsbehov.søknadsdata
              .harSendtInnTidligere
              ? true
              : harSendtInnPåAnnenMåte;
          }
        });
      });

      return {
        ...behov,
        opplastedeVedlegg: ettersendteVedlegg,
        harSendtInn: harSendtInnPåAnnenMåte,
      };
    });

  return {
    ...søknad,
    dokumentasjonsbehov: { dokumentasjonsbehov: dokumentasjonsbehov },
  };
};
