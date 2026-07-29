import React, { useState, useEffect, createContext } from 'react';
import {
  InnloggetStatus,
  verifiserAtSøkerErAutentisert,
} from '../../shared-utils/autentisering';
import { hentPersoninfo } from '../api-service';
import { ISøker } from '../typer/søker';
import { kjørerLokalt } from '../../shared-utils/miljø';

interface AppContextType {
  innloggetStatus: InnloggetStatus;
  søker: ISøker | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

const lokalSøker: ISøker = {
  forkortetNavn: 'Test Testesen',
  fnr: '31458931375',
  adresse: {
    adresse: 'Testveien 1',
    postnummer: '0001',
    poststed: 'Oslo',
  },
  egenansatt: false,
  erStrengtFortrolig: false,
  siviltilstand: 'UGIFT',
  statsborgerskap: 'NOR',
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [innloggetStatus, setInnloggetStatus] = useState<InnloggetStatus>(
    kjørerLokalt()
      ? InnloggetStatus.AUTENTISERT
      : InnloggetStatus.IKKE_VERIFISERT,
  );

  const [søker, settSøker] = useState<ISøker | null>(() => {
    if (kjørerLokalt()) {
      return lokalSøker;
    }
    return null;
  });

  useEffect(() => {
    if (!kjørerLokalt()) {
      verifiserAtSøkerErAutentisert(setInnloggetStatus);
    }
  }, []);

  useEffect(() => {
    const hentOgSettSøker = async () => {
      if (innloggetStatus === InnloggetStatus.AUTENTISERT) {
        try {
          const personInfo = await hentPersoninfo();
          settSøker(personInfo.søker);
        } catch {
          console.warn('Klarte ikke hente søkerinfo');
        }
      }
    };

    hentOgSettSøker();
  }, [innloggetStatus]);

  const value = {
    innloggetStatus,
    søker,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
