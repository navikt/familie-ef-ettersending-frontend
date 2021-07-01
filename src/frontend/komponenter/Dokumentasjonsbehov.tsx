import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import Krav from './Krav';
import { useEffect } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../context/AppContext';

export const Dokumentasjonsbehov: React.FC = () => {
  const [søknadsdata, settSøknadsdata] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const context = useApp();

  const hentData = () => {
    axios
      .get(
        'http://localhost:8091/api/dokumentasjonsbehov/e0c4a9cf-8422-4385-aa4b-409f5a718da3',
        {
          withCredentials: true,
        }
      )
      .then((response: { data: any }) => {
        //console.log(response.data);
        settSøknadsdata(response.data);
        setLoading(false);
      });
  };

  const sendInnDokumenter = (dokumenter) => {
    console.log(dokumenter);
  };
  useEffect(() => hentData(), []);

  if (isLoading) {
    return <NavFrontendSpinner />;
  }

  return (
    <div>
      <div>
        {søknadsdata.dokumentasjonsbehov.map((krav) => (
          <Krav key={krav.id} krav={krav} />
        ))}
      </div>
      <div>
        <Hovedknapp onClick={() => sendInnDokumenter(context.søknadsdataNy)}>
          Send inn
        </Hovedknapp>
      </div>
    </div>
  );
};
