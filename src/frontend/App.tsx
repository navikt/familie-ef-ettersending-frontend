import React from 'react';
import { useApp } from './hooks/useApp';
import { InnloggetStatus } from '../shared-utils/autentisering';
import sjekklisteikon from './icons/sjekklisteikon.svg';
import Ettersendingsoversikt from './komponenter/Ettersendingsoversikt';
import { BodyLong, Box, Heading, Loader, Page, VStack } from '@navikt/ds-react';

const App: React.FC = () => {
  const context = useApp();

  if (context.innloggetStatus === InnloggetStatus.AUTENTISERT) {
    return (
      <Page>
        <Page.Block as="main" width="md" gutters>
          <VStack gap={'space-24'}>
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
            <Heading level={'1'} size={'xlarge'} align="center">
              Ettersending av dokumentasjon
            </Heading>
            <BodyLong align="center">
              Her kan du sende inn manglende dokumentasjon til saken din
            </BodyLong>
            <Ettersendingsoversikt />
          </VStack>
        </Page.Block>
      </Page>
    );
  } else {
    return (
      <VStack align={'center'}>
        <Loader size={'xlarge'} title={'Venter på innlogging'} />
      </VStack>
    );
  }
};

export default App;
