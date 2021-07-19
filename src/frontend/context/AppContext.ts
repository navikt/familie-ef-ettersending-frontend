import { useState, useEffect } from 'react';
import createUseContext from 'constate';
import {
  InnloggetStatus,
  verifiserAtSøkerErAutentisert,
} from '../../shared-utils/autentisering';
import { hentPersoninfo } from '../api-service';
import { ISøker } from '../typer/søker';
import { IVedlegg } from '../typer/søknadsdata';

const [AppProvider, useApp] = createUseContext(() => {
  const [innloggetStatus, setInnloggetStatus] = useState<InnloggetStatus>(
    InnloggetStatus.IKKE_VERIFISERT
  );
  const [søker, settSøker] = useState<ISøker>(null);
  const [åpenEttersendingVedlegg, settÅpenEttersendingVedlegg] = useState<
    IVedlegg[]
  >([]);

  useEffect(() => {
    verifiserAtSøkerErAutentisert(setInnloggetStatus);
  }, []);

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
    innloggetStatus,
    søker,
    åpenEttersendingVedlegg,
  };
});

export { AppProvider, useApp };
