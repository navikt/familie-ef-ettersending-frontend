import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

export const Dokumentasjonsbehov: React.FC = () => {
  const [data, settData] = useState();

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
      });
  };

  useEffect(hentData, []);
  return (
    <div>
      <h1>Dokumentasjonsbehov</h1>
    </div>
  );
};
