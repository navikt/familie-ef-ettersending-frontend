import { useState, useEffect } from 'react';
import createUseContext from 'constate';
import {
  InnloggetStatus,
  verifiserAtSøkerErAutentisert,
} from '../../shared-utils/autentisering';
import { IHarSendtInnMedKrav, IVedleggMedKrav } from '../typer/søknadsdata';

import { hentPersoninfo } from '../api-service';
import { ISøker } from '../typer/søker';

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

  const leggTilVedleggMedKrav = (vedleggMedKrav: IVedleggMedKrav) => {
    settVedleggMedKrav((søknadsdataNy) => [...søknadsdataNy, vedleggMedKrav]);
  };

  const oppdaterHarSendtInnMedKrav = (
    harSendtInnMedKrav: IHarSendtInnMedKrav
  ) => {
    settHarSendtInnMedKrav((harSendtInnNy) => [
      ...harSendtInnNy,
      harSendtInnMedKrav,
    ]);
  };

  const slettVedleggMedKrav = (dokumentId) => {
    const oppdatertVedleggMedKrav = vedleggMedKrav.filter(
      (element) => element.vedlegg.id !== dokumentId
    );
    settVedleggMedKrav(oppdatertVedleggMedKrav);
  };

  useEffect(() => {
    const hentOgSettSøker = async () => {
      if (innloggetStatus === InnloggetStatus.AUTENTISERT) {
        settSøker(await (await hentPersoninfo()).søker);
      }
    };
    hentOgSettSøker();
  }, [innloggetStatus]);

  return {
    leggTilVedleggMedKrav,
    slettVedleggMedKrav,
    oppdaterHarSendtInnMedKrav,
    harSendtInnMedKrav,
    vedleggMedKrav,
    innloggetStatus,
    søker,
  };
});

export { AppProvider, useApp };
