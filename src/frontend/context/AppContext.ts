import { useState, useEffect } from 'react';
import createUseContext from 'constate';
import {
  InnloggetStatus,
  verifiserAtSøkerErAutentisert,
} from '../../shared-utils/autentisering';
import { IHarSendtInnMedKrav, IVedleggMedKrav } from '../typer/søknadsdata';

import { hentPersoninfo } from '../api-service';
import { ISøker } from '../typer/søker';
import { IVedlegg } from '../typer/søknadsdata';
import {
  IDokumentasjonsbehov,
  IDokumentasjonsbehovListe,
} from '../typer/dokumentasjonsbehov';

const [AppProvider, useApp] = createUseContext(() => {
  const [vedleggMedKrav, settVedleggMedKrav] = useState<IVedleggMedKrav[]>([]);
  const [innloggetStatus, setInnloggetStatus] = useState<InnloggetStatus>(
    InnloggetStatus.IKKE_VERIFISERT
  );
  const [harSendtInnMedKrav, settHarSendtInnMedKrav] = useState<
    IHarSendtInnMedKrav[]
  >([]);
  const [søker, settSøker] = useState<ISøker>(null);

  useEffect(() => {
    verifiserAtSøkerErAutentisert(setInnloggetStatus);
  }, []);

  const oppdaterHarSendtInnMedKrav = (
    harSendtInnMedKrav: IHarSendtInnMedKrav
  ) => {
    settHarSendtInnMedKrav((harSendtInn) => [
      ...harSendtInn,
      harSendtInnMedKrav,
    ]);
  };

  const slettVedleggMedKrav = (dokumentId) => {
    const oppdatertVedleggMedKrav = vedleggMedKrav.filter(
      (element) => element.vedlegg.id !== dokumentId
    );
    settVedleggMedKrav(oppdatertVedleggMedKrav);
  };

  //Ny struktur under
  const [dokumentasjonsbehov, settDokumentasjonsbehov] =
    useState<IDokumentasjonsbehov[]>();

  const leggTilDokumentasjonsbehov = (ny) => {
    settVedleggMedKrav((data) => [...data, ny]);
  };

  const leggTilVedlegg = (vedlegg: IVedlegg, behovId: string) => {
    const dokumentasjonsbehovMedVedlegg = dokumentasjonsbehov.map((behov) => {
      if ((behov.id = behovId)) {
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

  const leggTilHarSendtInn = (harSendtInn: boolean, behovId: string) => {
    const dokumentasjonsbehovMedHarSendtInn = dokumentasjonsbehov.map(
      (behov) => {
        if ((behov.id = behovId)) {
          return { ...behov, harSendtInn: harSendtInn };
        } else {
          return behov;
        }
      }
    );
    settDokumentasjonsbehov(dokumentasjonsbehovMedHarSendtInn);
  };

  //Krav
  //Vedlegg[]
  //HarSendtinn

  useEffect(() => {
    const hentOgSettSøker = async () => {
      if (innloggetStatus === InnloggetStatus.AUTENTISERT) {
        settSøker(await (await hentPersoninfo()).søker);
      }
    };
    hentOgSettSøker();
  }, [innloggetStatus]);

  return {
    leggTilHarSendtInn,
    slettVedleggMedKrav,
    oppdaterHarSendtInnMedKrav,
    leggTilDokumentasjonsbehov,
    settDokumentasjonsbehov,
    leggTilVedlegg,
    harSendtInnMedKrav,
    vedleggMedKrav,
    innloggetStatus,
    søker,
    dokumentasjonsbehov,
  };
});

export { AppProvider, useApp };
