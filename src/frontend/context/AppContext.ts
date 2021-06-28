import { useState, useEffect } from 'react';
import enviroment from '../../backend/environment';
import createUseContext from 'constate';
import axios from 'axios';

export enum InnloggetStatus {
  AUTENTISERT = 'innlogget',
  FEILET = 'ikke logget inn (innlogging feilet)',
  IKKE_VERIFISERT = 'ikke logget inn',
}

const [AppProvider, useApp] = createUseContext(() => {
  const [testVerdi, setTestVerdi] = useState('Default testverdi');
  const [innloggetStatus, setInnloggetStatus] = useState<InnloggetStatus>(
    InnloggetStatus.IKKE_VERIFISERT
  );

  useEffect(() => {
    verifiserAtBrukerErAutentisert();
  }, []);

  const verifiserAtBrukerErAutentisert = () => {
    axios
      .get(enviroment().innlogginUrl, { withCredentials: true })
      .then(() => setInnloggetStatus(InnloggetStatus.AUTENTISERT))
      .catch(() => setInnloggetStatus(InnloggetStatus.FEILET));
  };

  return {
    testVerdi,
    setTestVerdi,
    innloggetStatus,
  };
});

export { AppProvider, useApp };
