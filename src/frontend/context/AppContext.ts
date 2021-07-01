import { useState, useEffect } from 'react';
import createUseContext from 'constate';
import {
  InnloggetStatus,
  verifiserAtBrukerErAutentisert,
} from '../../shared-utils/autentisering';
import axios from 'axios';
import { ISøker } from '../typer/person';

const [AppProvider, useApp] = createUseContext(() => {
  const [testVerdi, setTestVerdi] = useState('Default testverdi');
  const [innloggetStatus, setInnloggetStatus] = useState<InnloggetStatus>(
    InnloggetStatus.IKKE_VERIFISERT
  );
  const [søker, settSøker] = useState<ISøker>(null);

  const hentPersoninfo = () => {
    axios
      .get('http://localhost:8091/api/oppslag/sokerinfo', {
        withCredentials: true,
      })
      .then((response: { data: any }) => {
        settSøker(response.data.søker);
        console.log('okiii');
      });
    return;
  };
  useEffect(() => {
    verifiserAtBrukerErAutentisert(setInnloggetStatus);
  }, []);

  useEffect(() => {
    if (innloggetStatus === InnloggetStatus.AUTENTISERT) {
      hentPersoninfo();
    }
  }, [innloggetStatus]);

  return {
    testVerdi,
    setTestVerdi,
    innloggetStatus,
    søker,
  };
});

export { AppProvider, useApp };
