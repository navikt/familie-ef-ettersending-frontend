import React, { useState } from 'react';
import './app.less';
import Filopplasting from './komponenter/Filopplasting';
import DisplayContext from './komponenter/DisplayContext';
import InputForm from './komponenter/InputForm';
import { Knapp } from 'nav-frontend-knapper';
import axios from 'axios';
import { response } from 'express';
import { Dokumentasjonsbehov } from './komponenter/Dokumentasjonsbehov';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

const App = () => {
  const [navn, settNavn] = useState('');

  const hentData = () => {
    return axios
      .get('http://localhost:8091/api/oppslag/sokerinfo', {
        withCredentials: true,
      })
      .then((response: { data: any }) => {
        console.log(response.data);
      });
  };

  const hentPerson = () => {
    return axios
      .get('http://localhost:8091/api/oppslag/sokerinfo', {
        withCredentials: true,
      })
      .then((response: { data: any }) => {
        console.log(response.data.søker.forkortetNavn);
        settNavn(response.data.søker.forkortetNavn);
      });
  };

  hentData();
  hentPerson();

  return (
    <div className="bakgrunn">
      <div className="app-konteiner">
        <h1>Ettersending av dokumentasjon</h1>
        <Ekspanderbartpanel tittel="Klikk her for å åpne/lukke panelet">
          <Filopplasting />
        </Ekspanderbartpanel>
      </div>
    </div>
  );
};

export default App;
