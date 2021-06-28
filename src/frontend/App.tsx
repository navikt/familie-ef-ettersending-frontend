import React from 'react';
import './app.less';
import Filopplasting from './komponenter/Filopplasting';
import { Knapp } from 'nav-frontend-knapper';
import { InnloggetStatus, useApp } from './context/AppContext';
import NavFrontendSpinner from 'nav-frontend-spinner';

const App = () => {
  const context = useApp();

  if (context.innloggetStatus === InnloggetStatus.AUTENTISERT) {
    return (
      <div className="bakgrunn">
        <div className="app-konteiner">
          <h1>Ettersending av dokumentasjon</h1>
          <h3>Bruker er {context.innloggetStatus}</h3>
          <Filopplasting />
          <Knapp className="innsendingsknapp" type={'standard'}>
            Send inn
          </Knapp>
        </div>
      </div>
    );
  } else {
    return <NavFrontendSpinner className="spinner" />;
  }
};

export default App;
