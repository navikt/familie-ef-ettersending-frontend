import axios from 'axios';
import environment from '../backend/environment';
import { IDokumentasjonsbehovListe } from './typer/dokumentasjonsbehov';
import { IPersoninfo } from './typer/søker';

interface Ifamilievedlegg {
  dokumentId: string;
  filnavn: string;
}

export const sendEttersending = (ettersendingsdata): Promise<string> => {
  return axios
    .post('http://localhost:8091/api/ettersending', ettersendingsdata, {
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export const hentPersoninfo = (): Promise<IPersoninfo> => {
  return axios
    .get(`${environment().apiUrl}/api/oppslag/sokerinfo`, {
      withCredentials: true,
    })
    .then((response: { data: IPersoninfo }) => {
      return response.data;
    });
};

export const hentDokumentasjonsbehov = (personIdent) => {
  return axios
    .post(
      `${environment().apiUrl}/api/dokumentasjonsbehov/person`,
      { ident: personIdent },
      {
        withCredentials: true,
      }
    )
    .then((response: { data: IDokumentasjonsbehovListe[] }) => {
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
      console.log(error);
      return error;
    });
};
