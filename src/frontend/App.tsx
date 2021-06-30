import React from 'react';
import './app.less';
import { Dokumentasjonsbehov } from './komponenter/Dokumentasjonsbehov';
import { useApp } from './context/AppContext';
import NavFrontendSpinner from 'nav-frontend-spinner';
import {
  autentiseringsInterceptor,
  InnloggetStatus,
} from '../shared-utils/autentisering';

const App = () => {
  const context = useApp();

  autentiseringsInterceptor();

  if (context.innloggetStatus === InnloggetStatus.AUTENTISERT) {
    return (
      <div className="bakgrunn">
        <div className="app-konteiner">
          <h1>Ettersending av dokumentasjon</h1>
          <h3>Bruker er {context.innloggetStatus}</h3>
          <Dokumentasjonsbehov />
        </div>
      </div>
    );
  } else {
    return <NavFrontendSpinner className="spinner" />;
  }
};

export default App;
