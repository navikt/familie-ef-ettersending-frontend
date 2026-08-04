import { Dispatch, SetStateAction } from 'react';
import environment, { isLocal } from '../backend/environment.js';

export enum InnloggetStatus {
  AUTENTISERT = 'innlogget',
  FEILET = 'ikke logget inn (innlogging feilet)',
  IKKE_VERIFISERT = 'ikke logget inn',
}

const getLoginUrl = () => {
  if (isLocal()) {
    return environment().wonderwallUrl + `${window.location.origin}`;
  }
  return (
    environment().wonderwallUrl +
    `${window.location.origin}/familie/alene-med-barn/ettersending`
  );
};

export const håndter401 = (response: Response): void => {
  if (response.status === 401 && !isLocal()) {
    window.location.href = getLoginUrl();
  }
};

export const verifiserAtSøkerErAutentisert = (
  settAutentisering: Dispatch<SetStateAction<InnloggetStatus>>,
) => {
  return verifiserInnloggetApi()
    .then((response) => {
      if (response.ok) {
        settAutentisering(InnloggetStatus.AUTENTISERT);
      } else {
        settAutentisering(InnloggetStatus.FEILET);
      }
    })
    .catch(() => {
      settAutentisering(InnloggetStatus.FEILET);
    });
};

const verifiserInnloggetApi = () => {
  return fetch(`${environment().apiProxyUrl}/api/innlogget`, {
    credentials: 'include',
  });
};
