import axios from 'axios';
import { ISøker } from './typer/søker';
import environment from '../backend/environment';
import { IDokumentasjonsbehovListe } from './typer/dokumentasjonsbehov';
import { IPersoninfo } from './typer/søker';

interface Ifamilievedlegg {
  dokumentId: string;
  filnavn: string;
}

/*
export const hentSøkerinfo = (): Promise<ISøker> => {
  return axios
    .get(`${environment().apiUrl}/api/oppslag/sokerinfo`, {
      withCredentials: true,
    })
    .then((response: { data: IPersoninfo }) => {
      return response.data.søker;
    });
  }

export const hentBarn = (): Promise<any> => {
    return axios
      .get(`${environment().apiUrl}/api/oppslag/sokerinfo`, {
        withCredentials: true,
      })
      .then((response: { data: IPersoninfo }) => {
        return response.data.barn;
      });
    }

    */

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
      return error;
    });
};
