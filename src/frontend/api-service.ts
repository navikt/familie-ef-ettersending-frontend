import axios from 'axios';
import { ISøker } from './typer/søker';
import environment from '../backend/environment';

interface ISøkerinfo {
  søker: ISøker;
}

interface Ifamilievedlegg {
  dokumentId: string;
  filnavn: string;
}

export const hentSøkerinfo = (): Promise<ISøker> => {
  return axios
    .get(`${environment().apiUrl}/api/oppslag/sokerinfo`, {
      withCredentials: true,
    })
    .then((response: { data: ISøkerinfo }) => {
      return response.data.søker;
    });
};

export const hentDokumentasjonsbehov = () => {
  return axios
    .get(
      `${
        environment().apiUrl
      }/api/dokumentasjonsbehov/e0c4a9cf-8422-4385-aa4b-409f5a718da3`,
      {
        withCredentials: true,
      }
    )
    .then((response: { data: any }) => {
      return response.data;
    });
};

export const sendVedleggTilMellomlager = (formData): Promise<string> => {
  return axios
    .post(`${environment().dokumentUrl}`, formData, {
      headers: { 'content-type': 'multipart/form-data' },
      withCredentials: true,
    })
    .then((response: { data: Ifamilievedlegg }) => {
      return response.data.dokumentId;
    })
    .catch((error) => {
      return error;
    });
};
