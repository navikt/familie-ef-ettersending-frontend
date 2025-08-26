import { useState, useEffect } from 'react';
import createUseContext from 'constate';
import {
  InnloggetStatus,
  verifiserAtSøkerErAutentisert,
} from '../../shared-utils/autentisering';
import { hentPersoninfo } from '../api-service';
import type { ISøker } from '../typer/søker';

const [AppProvider, useApp] = createUseContext(() => {
  const [innloggetStatus, setInnloggetStatus] = useState<InnloggetStatus>(
    InnloggetStatus.IKKE_VERIFISERT,
  );
  const [søker, settSøker] = useState<ISøker | null>(null);

  useEffect(() => {
    verifiserAtSøkerErAutentisert(setInnloggetStatus);
  }, []);

  useEffect(() => {
    const hentOgSettSøker = async () => {
      if (innloggetStatus === InnloggetStatus.AUTENTISERT) {
        const personInfo = await hentPersoninfo();
        console.log('personInfo', personInfo);
        settSøker(personInfo.søker);
      }
    };
    hentOgSettSøker();
  }, [innloggetStatus]);

  return {
    innloggetStatus,
    søker,
  };
});

export { AppProvider, useApp };
