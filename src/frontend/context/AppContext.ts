import { useState, useEffect } from 'react';
import createUseContext from 'constate';
import {
  InnloggetStatus,
  verifiserAtBrukerErAutentisert,
} from '../../shared-utils/autentisering';

const [AppProvider, useApp] = createUseContext(() => {
  const [søknadsdataNy, settSøkndadsdataNy] = useState([]);
  const [dokumentMedKrav, settDokumentMedKrav] = useState([]);
  const [innloggetStatus, setInnloggetStatus] = useState<InnloggetStatus>(
    InnloggetStatus.IKKE_VERIFISERT
  );

  useEffect(() => {
    verifiserAtBrukerErAutentisert(setInnloggetStatus);
  }, []);

  const leggTilFiler = (fil) => {
    settSøkndadsdataNy((søknadsdataNy) => [...søknadsdataNy, fil]);
  };

  const leggTilTuppel = (tuppel) => {
    settDokumentMedKrav((dokumentMedKrav) => [...dokumentMedKrav, tuppel]);
  };

  return {
    leggTilFiler,
    leggTilTuppel,
    dokumentMedKrav,
    søknadsdataNy,
    innloggetStatus,
  };
});

export { AppProvider, useApp };
