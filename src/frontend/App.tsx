import React from 'react';
import './app.less';
import Filopplasting from './komponenter/Filopplasting';
import { Knapp } from 'nav-frontend-knapper';
import DisplayContext from './komponenter/DisplayContext';
import InputForm from './komponenter/InputForm';

const App = () => {
  return (
    <div className="bakgrunn">
      <div className="app-konteiner">
        <h1>Ettersending av dokumentasjon</h1>
        <Filopplasting />
        <Knapp className="innsendingsknapp" type={'standard'}>
          Send inn
        </Knapp>
      </div>
    </div>
  );
};

export default App;
