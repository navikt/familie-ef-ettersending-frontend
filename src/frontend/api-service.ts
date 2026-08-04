import environment from '../backend/environment';
import { IEttersending, ISøknadsbehov } from './typer/ettersending';
import { IPersoninfo } from './typer/søker';
import { Ressurs } from './typer/ressurs';
import { håndter401 } from '../shared-utils/autentisering';

interface Ifamilievedlegg {
  dokumentId: string;
  filnavn: string;
}

interface IKvittering {
  text: string;
  mottattDato: string;
}

const HEADER_NAV_CONSUMER_ID = 'Nav-Consumer-Id';
const HEADER_NAV_CONSUMER_ID_VALUE = 'familie-ef-ettersending';

const HEADER_NAV_CONSUMER = {
  [HEADER_NAV_CONSUMER_ID]: HEADER_NAV_CONSUMER_ID_VALUE,
};

export interface ApiError extends Error {
  status: number;
  data?: unknown;
}

const håndterRespons = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    håndter401(response);
    const errorBody = await response.json().catch(() => undefined);
    const error = new Error(
      `HTTP ${response.status}: ${response.statusText}`,
    ) as ApiError;
    error.status = response.status;
    error.data = errorBody;
    throw error;
  }
  return response.json() as Promise<T>;
};

export const sendEttersending = (
  ettersendingsdata: IEttersending,
): Promise<IKvittering> => {
  return fetch(`${environment().apiProxyUrl}/api/ettersending`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...HEADER_NAV_CONSUMER,
    },
    body: JSON.stringify(ettersendingsdata),
  }).then(håndterRespons<IKvittering>);
};

export const hentEttersendinger = (): Promise<IEttersending[]> => {
  return fetch(`${environment().apiProxyUrl}/api/ettersending`, {
    credentials: 'include',
    headers: HEADER_NAV_CONSUMER,
  }).then(håndterRespons<IEttersending[]>);
};

export const hentOpplastetVedlegg = (
  dokumentId: string,
): Promise<Ressurs<string>> => {
  return fetch(
    `${environment().dokumentProxyUrl}/dokument/api/mapper/familievedlegg/${dokumentId}`,
    {
      credentials: 'include',
      headers: HEADER_NAV_CONSUMER,
    },
  ).then(håndterRespons<Ressurs<string>>);
};

export const hentPersoninfo = (): Promise<IPersoninfo> => {
  return fetch(`${environment().apiProxyUrl}/api/oppslag/sokerinfo`, {
    credentials: 'include',
    headers: HEADER_NAV_CONSUMER,
  }).then(håndterRespons<IPersoninfo>);
};

export const hentSøknader = (): Promise<ISøknadsbehov[]> => {
  return fetch(`${environment().apiProxyUrl}/api/dokumentasjonsbehov/person`, {
    credentials: 'include',
    headers: HEADER_NAV_CONSUMER,
  }).then(håndterRespons<ISøknadsbehov[]>);
};

export const sendVedleggTilMellomlager = (
  formData: FormData,
): Promise<string> => {
  return fetch(
    `${environment().dokumentProxyUrl}/dokument/api/mapper/familievedlegg`,
    {
      method: 'POST',
      credentials: 'include',
      headers: HEADER_NAV_CONSUMER,
      body: formData,
    },
  )
    .then(håndterRespons<Ifamilievedlegg>)
    .then((data) => data.dokumentId);
};

export const slåSammenVedlegg = (dokumentIder: string[]): Promise<string> => {
  return fetch(
    `${environment().dokumentProxyUrl}/dokument/api/mapper/merge/familievedlegg`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...HEADER_NAV_CONSUMER,
      },
      body: JSON.stringify(dokumentIder),
    },
  )
    .then(håndterRespons<Ifamilievedlegg>)
    .then((data) => data.dokumentId);
};
