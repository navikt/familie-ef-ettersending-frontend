import React from 'react';
import './app.less';
import { DokumentasjonsbehovOversikt } from './komponenter/DokumentasjonsbehovOversikt';
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
        <div className="app-container">
          <h1>Ettersending av dokumentasjon</h1>
          <h3>Bruker er {context.innloggetStatus}</h3>
          <DokumentasjonsbehovOversikt />
        </div>
      </div>
    );
  } else {
    return <NavFrontendSpinner className="spinner" />;
  }
};

export default App;
