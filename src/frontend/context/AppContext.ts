import { useState, useEffect } from 'react';
import createUseContext from 'constate';
import {
  InnloggetStatus,
  verifiserAtSøkerErAutentisert,
} from '../../shared-utils/autentisering';
import { hentPersoninfo } from '../api-service';
import { ISøker } from '../typer/søker';
import { IVedlegg } from '../typer/søknadsdata';
import { IDokumentasjonsbehov } from '../typer/dokumentasjonsbehov';

const [AppProvider, useApp] = createUseContext(() => {
  const [innloggetStatus, setInnloggetStatus] = useState<InnloggetStatus>(
    InnloggetStatus.IKKE_VERIFISERT
  );
  const [dokumentasjonsbehov, settDokumentasjonsbehov] =
    useState<IDokumentasjonsbehov[]>();
  const [søker, settSøker] = useState<ISøker>(null);

  useEffect(() => {
    verifiserAtSøkerErAutentisert(setInnloggetStatus);
  }, []);

  const slettVedlegg = (dokumentId: string, behovId: string) => {
    const dokumentasjonsbehovMedVedlegg = dokumentasjonsbehov.map((behov) => {
      if (behov.id === behovId) {
        return {
          ...behov,
          opplastedeVedlegg: behov.opplastedeVedlegg.filter(
            (vedlegg) => vedlegg.id !== dokumentId
          ),
        };
      } else {
        return behov;
      }
    });
    settDokumentasjonsbehov(dokumentasjonsbehovMedVedlegg);
  };

  const leggTilVedlegg = (vedlegg: IVedlegg, behovId: string) => {
    const dokumentasjonsbehovMedVedlegg = dokumentasjonsbehov.map((behov) => {
      if (behov.id === behovId) {
        return {
          ...behov,
          opplastedeVedlegg: [...behov.opplastedeVedlegg, vedlegg],
        };
      } else {
        return behov;
      }
    });
    settDokumentasjonsbehov(dokumentasjonsbehovMedVedlegg);
  };

  const oppdaterHarSendtInn = (harSendtInn: boolean, behovId: string) => {
    const dokumentasjonsbehovMedHarSendtInn = dokumentasjonsbehov.map(
      (behov) => {
        if (behov.id === behovId) {
          return { ...behov, harSendtInn: harSendtInn };
        } else {
          return behov;
        }
      }
    );
    settDokumentasjonsbehov(dokumentasjonsbehovMedHarSendtInn);
  };

  useEffect(() => {
    const hentOgSettSøker = async () => {
      if (innloggetStatus === InnloggetStatus.AUTENTISERT) {
        const personInfo = await hentPersoninfo();
        settSøker(personInfo.søker);
      }
    };
    hentOgSettSøker();
  }, [innloggetStatus]);

  return {
    oppdaterHarSendtInn,
    slettVedlegg,
    settDokumentasjonsbehov,
    leggTilVedlegg,
    innloggetStatus,
    søker,
    dokumentasjonsbehov,
  };
});

export { AppProvider, useApp };
