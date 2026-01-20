import axios from 'axios';
import environment from '../backend/environment';
import { IEttersending, ISøknadsbehov } from './typer/ettersending';
import { IPersoninfo } from './typer/søker';
import { Ressurs } from './typer/ressurs';

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

export const sendEttersending = (
  ettersendingsdata: IEttersending,
): Promise<IKvittering> => {
  return axios
    .post(`${environment().apiProxyUrl}/api/ettersending`, ettersendingsdata, {
      withCredentials: true,
      headers: {
        [HEADER_NAV_CONSUMER_ID]: HEADER_NAV_CONSUMER_ID_VALUE,
      },
    })
    .then((response) => response.data);
};

export const hentEttersendinger = (): Promise<IEttersending[]> => {
  return axios
    .get(`${environment().apiProxyUrl}/api/ettersending`, {
      withCredentials: true,
      headers: {
        [HEADER_NAV_CONSUMER_ID]: HEADER_NAV_CONSUMER_ID_VALUE,
      },
    })
    .then((response: { data: IEttersending[] }) => response.data);
};

export const hentOpplastetVedlegg = (
  dokumentId: string,
): Promise<Ressurs<string>> => {
  return axios
    .get(
      `${
        environment().dokumentProxyUrl
      }/dokument/api/mapper/familievedlegg/${dokumentId}`,
      {
        withCredentials: true,
        headers: {
          [HEADER_NAV_CONSUMER_ID]: HEADER_NAV_CONSUMER_ID_VALUE,
        },
      },
    )
    .then((response: { data: Ressurs<string> }) => response.data);
};

export const hentPersoninfo = (): Promise<IPersoninfo> => {
  return axios
    .get(`${environment().apiProxyUrl}/api/oppslag/sokerinfo`, {
      withCredentials: true,
      headers: {
        [HEADER_NAV_CONSUMER_ID]: HEADER_NAV_CONSUMER_ID_VALUE,
      },
    })
    .then((response: { data: IPersoninfo }) => response.data);
};

export const hentSøknader = (): Promise<ISøknadsbehov[]> => {
  return axios
    .get(`${environment().apiProxyUrl}/api/dokumentasjonsbehov/person`, {
      withCredentials: true,
      headers: {
        [HEADER_NAV_CONSUMER_ID]: HEADER_NAV_CONSUMER_ID_VALUE,
      },
    })
    .then((response: { data: ISøknadsbehov[] }) => response.data);
};

export const sendVedleggTilMellomlager = (
  formData: FormData,
): Promise<string> => {
  return axios
    .post(
      `${environment().dokumentProxyUrl}/dokument/api/mapper/familievedlegg`,
      formData,
      {
        headers: {
          'content-type': 'multipart/form-data',
          [HEADER_NAV_CONSUMER_ID]: HEADER_NAV_CONSUMER_ID_VALUE,
        },
        withCredentials: true,
      },
    )
    .then((response: { data: Ifamilievedlegg }) => response.data.dokumentId);
};

export const slåSammenVedlegg = (dokumentIder: string[]): Promise<string> => {
  return axios
    .post(
      `${environment().dokumentProxyUrl}/api/mapper/merge/familievedlegg`,
      dokumentIder,
      {
        headers: {
          [HEADER_NAV_CONSUMER_ID]: HEADER_NAV_CONSUMER_ID_VALUE,
        },
        withCredentials: true,
      },
    )
    .then((response: { data: Ifamilievedlegg }) => response.data.dokumentId);
};
