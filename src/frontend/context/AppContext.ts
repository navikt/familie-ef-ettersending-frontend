import { useState } from 'react';

import createUseContext from 'constate';
import axios from 'axios';

export enum InnloggetStatus {
  AUTENTISERT,
  FEILET,
  IKKE_VERIFISERT,
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
      .get('http://localhost:8091/api/innlogget', { withCredentials: true })
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
