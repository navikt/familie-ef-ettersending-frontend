import { useEffect, useState } from 'react';
import React, { createContext } from 'react';

import createUseContext from 'constate';
import { preferredAxios } from '../api/axios';
import { Ressurs, RessursFeilet, RessursSuksess } from '../typer/ressurs';
import { ISaksbehandler } from '../typer/saksbehandler';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
//import environment from "../../backend/environment"

const [AppProvider, useApp] = createUseContext(() => {
  const [testVerdi, setTestVerdi] = useState('Default testverdi');

  useEffect(() => {
    verifiserAtBrukerErAutentisert();
  }, []);
  const [ressurserSomLaster, settRessurserSomLaster] = useState<string[]>([]);

  //  const { apiUrl } = environment();

  const verifiserAtBrukerErAutentisert = () => {
    return axiosRequest({
      url: `https://familie-ba-soknad.dev.nav.no/api/innlogget`,
      method: 'GET',
      withCredentials: true,
      påvirkerSystemLaster: true,
    })
      .then((_) => {
        console.log('autentisert');
      })
      .catch((_) => console.log('feilet.'));
  };

  const axiosRequest = async (
    config: AxiosRequestConfig & { data?: any; påvirkerSystemLaster?: boolean }
  ): Promise<any> => {
    const ressursId = `${config.method}_${config.url}`;
    config.påvirkerSystemLaster &&
      settRessurserSomLaster([...ressurserSomLaster, ressursId]);

    return preferredAxios
      .request(config)
      .then((response: AxiosResponse<any>) => {
        const responsRessurs = response.data;
        //config.påvirkerSystemLaster && fjernRessursSomLaster(ressursId);
        console.log(responsRessurs);
        //return håndterApiRessurs(responsRessurs);
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  return {
    testVerdi,
    setTestVerdi,
  };
});

export { AppProvider, useApp };
