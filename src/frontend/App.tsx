import React from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { Checkbox } from 'nav-frontend-skjema';
import './app.less';
import Filopplasting from './komponenter/Filopplasting';

const App = () => {
  return (
    <div className="app-konteiner">
      <h1>Ettersending av dokumentasjon</h1>
      <Filopplasting />
      <Knapp className="innsendingsknapp" type={'standard'}>
        Send inn
      </Knapp>
    </div>
  );
};

export default App;
