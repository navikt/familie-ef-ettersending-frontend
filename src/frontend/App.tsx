import React from 'react';
import './app.less';
import { useApp } from './context/AppContext';
import NavFrontendSpinner from 'nav-frontend-spinner';
import {
  autentiseringsInterceptor,
  InnloggetStatus,
} from '../shared-utils/autentisering';
import Veileder from 'nav-frontend-veileder';
import sjekklisteikon from './icons/sjekklisteikon.svg';
import styled from 'styled-components';
import Ettersendingsoversikt from './komponenter/Ettersendingsoversikt';
import { Normaltekst } from 'nav-frontend-typografi';

const StyledImg = styled.img`
  height: 100% !important;
`;

const App: React.FC = () => {
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
          <Normaltekst>
            Her kan du sende inn manglende dokumentasjon til søknaden eller
            saken din
          </Normaltekst>
          <Ettersendingsoversikt />
        </div>
      </div>
    );
  } else {
    return <NavFrontendSpinner className="spinner" />;
  }
};

export default App;
