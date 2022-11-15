import React from 'react';
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

const SjekklisteIkon = styled.img`
  height: 100% !important;
`;

const Bakgrunn = styled.div`
  background-color: #e9e7e7;
  padding-top: 5rem;
  padding-bottom: 8rem;

  @media (max-width: 480px) {
    padding: 0;
  }
`;

const AppContainer = styled.div`
  width: 792px;
  margin: auto;
  background-color: #ffffff;
  padding: 56px 80px 2rem 80px;
  border-radius: 4px;

  > h1 {
    width: fit-content;
    margin: auto;
    padding-bottom: 32px;
    margin-bottom: 32px;
    margin-top: 32px;
    border-bottom: 4px solid black;
    text-align: center;
  }

  > p {
    text-align: center;
    margin-bottom: 48px;
  }

  @media (max-width: 480px) {
    padding: 56px 15px 2rem 15px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const App: React.FC = () => {
  const context = useApp();

  autentiseringsInterceptor();

  if (context.innloggetStatus === InnloggetStatus.AUTENTISERT) {
    return (
      <Bakgrunn>
        <AppContainer>
          <Veileder>
            <SjekklisteIkon
              src={sjekklisteikon}
              className="sjekklisteikon"
              alt="sjekklisteikon"
            />
          </Veileder>
          <h1>Ettersending av dokumentasjon</h1>
          <Normaltekst>
            Her kan du sende inn manglende dokumentasjon til saken din
          </Normaltekst>
          <Ettersendingsoversikt />
        </AppContainer>
      </Bakgrunn>
    );
  } else {
    return <NavFrontendSpinner className="spinner" />;
  }
};

export default App;
