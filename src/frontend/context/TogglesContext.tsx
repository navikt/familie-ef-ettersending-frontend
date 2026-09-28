import React, { createContext, useContext, useEffect, useState } from 'react';
import { hentToggles } from '../api-service';
import { Toggles } from '../typer/toggles';

interface TogglesContextType {
  toggles: Toggles;
  erTogglePå: (toggle: string) => boolean;
}

const TogglesContext = createContext<TogglesContextType | undefined>(undefined);

interface TogglesProviderProps {
  children: React.ReactNode;
}

export const TogglesProvider = ({ children }: TogglesProviderProps) => {
  const [toggles, settToggles] = useState<Toggles>({});

  useEffect(() => {
    hentToggles()
      .then(settToggles)
      .catch((error: unknown) => {
        console.error('Klarte ikke hente feature toggles', error);
      });
  }, []);

  const erTogglePå = (toggle: string) => toggles[toggle] === true;

  return (
    <TogglesContext.Provider value={{ toggles, erTogglePå }}>
      {children}
    </TogglesContext.Provider>
  );
};

export const useToggles = () => {
  const context = useContext(TogglesContext);
  if (context === undefined) {
    throw new Error('useToggles må brukes innenfor en TogglesProvider');
  }

  return context;
};
