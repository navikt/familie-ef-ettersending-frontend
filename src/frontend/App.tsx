import React from 'react';
import './app.less';
import { DokumentasjonsbehovOversikt } from './komponenter/DokumentasjonsbehovOversikt';
import { useApp } from './context/AppContext';
import NavFrontendSpinner from 'nav-frontend-spinner';
import {
  autentiseringsInterceptor,
  InnloggetStatus,
} from '../shared-utils/autentisering';
import Veileder from 'nav-frontend-veileder';
import { FileContent } from '@navikt/ds-icons';

const App = () => {
  const context = useApp();

  autentiseringsInterceptor();

  if (context.innloggetStatus === InnloggetStatus.AUTENTISERT) {
    return (
      <div className="bakgrunn">
        <div className="app-container">
          <Veileder>
            <FileContent
              aria-label="System ikon"
              role="img"
              focusable="false"
            />
          </Veileder>
          <h1>Ettersending av dokumentasjon</h1>
          <p>Her kan du sende inn manglende dokumentasjon til din søknad</p>
          <DokumentasjonsbehovOversikt />
        </div>
      </div>
    );
  } else {
    return <NavFrontendSpinner className="spinner" />;
  }
};

export default App;
