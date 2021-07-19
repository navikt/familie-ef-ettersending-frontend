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
import Søknadsoversikt from './komponenter/Søknadsoversikt';
import sjekklisteikon from './icons/sjekklisteikon.svg';
import styled from 'styled-components';

const StyledImg = styled.img`
  height: 100% !important;
`;

const App = () => {
  const context = useApp();

  autentiseringsInterceptor();

  if (context.innloggetStatus === InnloggetStatus.AUTENTISERT) {
    return (
      <div className="bakgrunn">
        <div className="app-container">
          <Veileder>
            <StyledImg
              src={sjekklisteikon}
              className="sjekklisteikon"
              alt="sjekklisteikon"
            />
          </Veileder>
          <h1>Ettersending av dokumentasjon</h1>
          <p>Her kan du sende inn manglende dokumentasjon til din søknad</p>
          <Søknadsoversikt />
        </div>
      </div>
    );
  } else {
    return <NavFrontendSpinner className="spinner" />;
  }
};

export default App;
