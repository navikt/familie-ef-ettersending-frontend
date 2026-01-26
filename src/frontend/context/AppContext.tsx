import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  InnloggetStatus,
  verifiserAtSøkerErAutentisert,
} from '../../shared-utils/autentisering';
import { hentPersoninfo } from '../api-service';
import { ISøker } from '../typer/søker';

interface AppContextType {
  innloggetStatus: InnloggetStatus;
  søker: ISøker | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
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
        settSøker(personInfo.søker);
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

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp må brukes innenfor en AppProvider');
  }

  return context;
};
