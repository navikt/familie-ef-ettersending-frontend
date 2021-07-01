import { useState, useEffect } from 'react';
import createUseContext from 'constate';
import {
  InnloggetStatus,
  verifiserAtBrukerErAutentisert,
} from '../../shared-utils/autentisering';

const [AppProvider, useApp] = createUseContext(() => {
  const [søknadsdataNy, settSøkndadsdataNy] = useState([]);
  const [innloggetStatus, setInnloggetStatus] = useState<InnloggetStatus>(
    InnloggetStatus.IKKE_VERIFISERT
  );

  useEffect(() => {
    verifiserAtBrukerErAutentisert(setInnloggetStatus);
  }, []);

  const leggTilDokument = (tuppel) => {
    settSøkndadsdataNy((søknadsdataNy) => [...søknadsdataNy, tuppel]);
  };

  return {
    leggTilDokument,
    søknadsdataNy,
    innloggetStatus,
  };
});

export { AppProvider, useApp };
