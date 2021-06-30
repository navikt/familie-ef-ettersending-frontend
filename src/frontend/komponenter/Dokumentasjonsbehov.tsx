import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import Krav from './Krav';
import { useEffect } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';

export const Dokumentasjonsbehov: React.FC = () => {
  const [data, settData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const hentData = () => {
    axios
      .get(
        'http://localhost:8091/api/dokumentasjonsbehov/e0c4a9cf-8422-4385-aa4b-409f5a718da3',
        {
          withCredentials: true,
        }
      )
      .then((response: { data: any }) => {
        console.log(response.data);
        settData(response.data);
        setLoading(false);
      });
  };

  useEffect(() => hentData(), []);

  if (isLoading) {
    return <NavFrontendSpinner />;
  }
  return (
    <div>
      {data.dokumentasjonsbehov.map((krav) => (
        <Krav key={krav.id} krav={krav} />
      ))}
    </div>
  );
};
