import axios, { AxiosError } from 'axios';
import type { Dispatch, SetStateAction } from 'react';
import environment, { isLocal } from '../backend/environment';

export const InnloggetStatus = {
  AUTENTISERT: 'innlogget',
  FEILET: 'ikke logget inn (innlogging feilet)',
  IKKE_VERIFISERT: 'ikke logget inn',
} as const;

export type InnloggetStatus =
  (typeof InnloggetStatus)[keyof typeof InnloggetStatus];

const er401Feil = (error: AxiosError) =>
  error && error.response && error.response.status === 401;

const getLoginUrl = () => {
  if (isLocal()) {
    return environment().wonderwallUrl + `${window.location.origin}`;
  }
  return (
    environment().wonderwallUrl +
    `${window.location.origin}/familie/alene-med-barn/ettersending`
  );
};

export const autentiseringsInterceptor = () => {
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (er401Feil(error)) {
        window.location.href = getLoginUrl();
      } else {
        throw error;
      }
    },
  );
};

export const verifiserAtSøkerErAutentisert = (
  settAutentisering: Dispatch<SetStateAction<InnloggetStatus>>,
) => {
  const veri = verifiserInnloggetApi();

  return veri.then((response) => {
    if (response && 200 === response.status) {
      settAutentisering(InnloggetStatus.AUTENTISERT);
    } else {
      settAutentisering(InnloggetStatus.FEILET);
    }
  });
};

const verifiserInnloggetApi = () => {
  const url = `${environment().apiProxyUrl}/innlogget`;
  console.log('url', url);
  return axios.get(url, {
    // withCredentials: true,
  });
};
