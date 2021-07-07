import { useState, useEffect } from 'react';
import createUseContext from 'constate';
import {
  InnloggetStatus,
  verifiserAtSøkerErAutentisert,
} from '../../shared-utils/autentisering';
import { IVedleggMedKrav } from '../typer/søknadsdata';
import { ISøker } from '../typer/søker';
import { hentSøkerinfo } from '../api-service';

const [AppProvider, useApp] = createUseContext(() => {
  const [vedleggMedKrav, settVedleggMedKrav] = useState<IVedleggMedKrav[]>([]);
  const [innloggetStatus, setInnloggetStatus] = useState<InnloggetStatus>(
    InnloggetStatus.IKKE_VERIFISERT
  );
  const [søker, settSøker] = useState<ISøker>(null);

  useEffect(() => {
    verifiserAtSøkerErAutentisert(setInnloggetStatus);
  }, []);

  const leggTilVedleggMedKrav = (vedleggMedKrav: IVedleggMedKrav) => {
    settVedleggMedKrav((søknadsdataNy) => [...søknadsdataNy, vedleggMedKrav]);
  };

  const slettVedleggMedKrav = (dokumentId) => {
    const oppdatertVedleggMedKrav = vedleggMedKrav.filter(
      (element) => element.vedlegg.dokumentId !== dokumentId
    );
    settVedleggMedKrav(oppdatertVedleggMedKrav);
  };

  useEffect(() => {
    const hentOgSettSøker = async () => {
      if (innloggetStatus === InnloggetStatus.AUTENTISERT) {
        settSøker(await hentSøkerinfo());
      }
    };
    hentOgSettSøker();
  }, [innloggetStatus]);

  return {
    leggTilVedleggMedKrav,
    slettVedleggMedKrav,
    vedleggMedKrav,
    innloggetStatus,
    søker,
  };
});

export { AppProvider, useApp };
