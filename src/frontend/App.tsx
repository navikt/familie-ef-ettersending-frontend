import React from 'react';
import { useApp } from './context/AppContext';
import {
  autentiseringsInterceptor,
  InnloggetStatus,
} from '../shared-utils/autentisering';
import sjekklisteikon from './icons/sjekklisteikon.svg';
import Ettersendingsoversikt from './komponenter/Ettersendingsoversikt';
import { BodyLong, Heading, Loader, VStack } from '@navikt/ds-react';
import styles from './App.module.css';

const App: React.FC = () => {
  const context = useApp();

  autentiseringsInterceptor();

  if (context.innloggetStatus === InnloggetStatus.AUTENTISERT) {
    return (
      <div className={styles.bakgrunn}>
        <div className={styles.container}>
          <VStack align={'center'}>
            <div>
              <img
                src={sjekklisteikon}
                className="sjekklisteikon"
                alt="sjekklisteikon"
                aria-hidden={true}
              />
            </div>
          </VStack>
          <Heading level={'1'} size={'xlarge'}>
            Ettersending av dokumentasjon
          </Heading>
          <BodyLong>
            Her kan du sende inn manglende dokumentasjon til saken din
          </BodyLong>
          <Ettersendingsoversikt />
        </div>
      </div>
    );
  } else {
    return (
      <VStack align={'center'}>
        <Loader
          size={'xlarge'}
          title={'Venter på innlogging'}
          onResize={undefined}
          onResizeCapture={undefined}
        />
      </VStack>
    );
  }
};

export default App;
