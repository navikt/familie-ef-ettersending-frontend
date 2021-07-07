import axios, { AxiosError } from 'axios';
import environment from '../backend/environment';

export enum InnloggetStatus {
  AUTENTISERT = 'innlogget',
  FEILET = 'ikke logget inn (innlogging feilet)',
  IKKE_VERIFISERT = 'ikke logget inn',
}

const er401Feil = (error: AxiosError) =>
  error && error.response && error.response.status === 401;

const getLoginUrl = () => {
  return (
    environment().loginService +
    `&redirect=${window.location.origin}/familie/alene-med-barn/ettersending`
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
    }
  );
};

export const verifiserAtSøkerErAutentisert = (
  settAutentisering: (autentisering: InnloggetStatus) => void
) => {
  return verifiserInnloggetApi().then((response) => {
    if (response && 200 === response.status) {
      settAutentisering(InnloggetStatus.AUTENTISERT);
    } else {
      settAutentisering(InnloggetStatus.FEILET);
    }
  });
};

const verifiserInnloggetApi = () => {
  return axios.get(`${environment().apiUrl}/api/innlogget`, {
    withCredentials: true,
  });
};
