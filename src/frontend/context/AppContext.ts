import { useState, useEffect } from 'react';
import createUseContext from 'constate';
import {
  InnloggetStatus,
  verifiserAtBrukerErAutentisert,
} from '../../shared-utils/autentisering';

const [AppProvider, useApp] = createUseContext(() => {
  const [testVerdi, setTestVerdi] = useState('Default testverdi');
  const [innloggetStatus, setInnloggetStatus] = useState<InnloggetStatus>(
    InnloggetStatus.IKKE_VERIFISERT
  );

  useEffect(() => {
    verifiserAtBrukerErAutentisert(setInnloggetStatus);
  }, []);

  return {
    testVerdi,
    setTestVerdi,
    innloggetStatus,
  };
});

export { AppProvider, useApp };
