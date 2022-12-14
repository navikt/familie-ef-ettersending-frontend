import React from 'react';
import { useApp } from './context/AppContext';
import {
  autentiseringsInterceptor,
  InnloggetStatus,
} from '../shared-utils/autentisering';
import sjekklisteikon from './icons/sjekklisteikon.svg';
import styled from 'styled-components';
import Ettersendingsoversikt from './komponenter/Ettersendingsoversikt';
import { Heading, Ingress, Loader, Modal } from '@navikt/ds-react';

// Gjemmer innhold i bakkant av modal for skjermlesere når modalen er åpen
Modal.setAppElement(document.getElementById('root'));

const FlexBox = styled.div`
  display: flex;
  justify-content: center;
`;

const Bakgrunn = styled.div`
  background-color: var(--a-bg-subtle);
  padding-top: 5rem;
  padding-bottom: 8rem;

  @media (max-width: 480px) {
    padding: 0;
  }
`;

const AppContainer = styled.div`
  width: 792px;
  margin: auto;
  background-color: var(--a-bg-default);
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
          <FlexBox>
            <img
              src={sjekklisteikon}
              className="sjekklisteikon"
              alt="sjekklisteikon"
              aria-hidden={true}
            />
          </FlexBox>
          <Heading level={'1'} size={'xlarge'}>
            Ettersending av dokumentasjon
          </Heading>
          <Ingress>
            Her kan du sende inn manglende dokumentasjon til saken din
          </Ingress>
          <Ettersendingsoversikt />
        </AppContainer>
      </Bakgrunn>
    );
  } else {
    return (
      <FlexBox>
        <Loader size={'xlarge'} title={'Venter på innlogging'} />
      </FlexBox>
    );
  }
};

export default App;
