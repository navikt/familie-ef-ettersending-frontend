import axios from 'axios';
import environment from '../backend/environment';
import {
  IEttersendingMedDato,
  IEttersending,
  ISøknadsbehov,
} from './typer/ettersending';
import { IPersoninfo } from './typer/søker';

interface Ifamilievedlegg {
  dokumentId: string;
  filnavn: string;
}

interface IKvittering {
  text: string;
  mottattDato: string;
}

export const sendEttersending = (
  ettersendingsdata: IEttersending
): Promise<IKvittering> => {
  return axios
    .post(`${environment().apiUrl}/api/ettersending`, ettersendingsdata, {
      withCredentials: true,
    })
    .then((response) => response.data);
};

export const hentEttersendinger = (): Promise<IEttersendingMedDato[]> => {
  return axios
    .get(`${environment().apiUrl}/api/ettersending`, { withCredentials: true })
    .then((response) => response.data);
};

export const hentPersoninfo = (): Promise<IPersoninfo> => {
  return axios
    .get(`${environment().apiUrl}/api/oppslag/sokerinfo`, {
      withCredentials: true,
    })
    .then((response: { data: IPersoninfo }) => response.data);
};

export const hentDokumentasjonsbehov = (): Promise<ISøknadsbehov[]> => {
  return axios
    .get(`${environment().apiUrl}/api/dokumentasjonsbehov/person`, {
      withCredentials: true,
    })
    .then((response: { data: ISøknadsbehov[] }) => response.data);
};

export const sendVedleggTilMellomlager = (
  formData: FormData
): Promise<string> => {
  return axios
    .post(`${environment().dokumentUrl}`, formData, {
      headers: { 'content-type': 'multipart/form-data' },
      withCredentials: true,
    })
    .then((response: { data: Ifamilievedlegg }) => response.data.dokumentId);
};
