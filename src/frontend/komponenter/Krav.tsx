import React, { useState } from 'react';
import './app.less';
import Filopplasting from './Filopplasting';
import DisplayContext from './DisplayContext';
import InputForm from './InputForm';
import { Knapp } from 'nav-frontend-knapper';
import axios from 'axios';
import { response } from 'express';
import { Dokumentasjonsbehov } from './Dokumentasjonsbehov';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

const Krav = () => {
  return (
    <Ekspanderbartpanel tittel="Klikk her for å åpne/lukke panelet">
      <Filopplasting />
    </Ekspanderbartpanel>
  );
};

export default Krav;
