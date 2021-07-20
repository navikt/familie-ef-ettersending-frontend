import React from 'react';
import '../stil/Vedleggsopplaster.less';
import { DokumentasjonsbehovOversikt } from './DokumentasjonsbehovOversikt';
import { useApp } from '../context/AppContext';
import { hentDokumentasjonsbehov, sendEttersending } from '../api-service';
import { useState } from 'react';
import { useEffect } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import {
  ISøknadsbehov,
  IÅpenEttersendingMedStønadstype,
} from '../typer/søknadsdata';
import ÅpenEttersending from './ÅpenEttersending';
import { Hovedknapp } from 'nav-frontend-knapper';
import styled from 'styled-components/macro';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

const SoknadContainer = styled.div`
  margin-bottom: 5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid lightgray;
`;

const AlertStripeFeilStyled = styled(AlertStripeFeil)`
  margin-top: 1rem;
`;

const Søknadsoversikt = () => {
  const [laster, settLasterverdi] = useState(true);
  const [søknader, settSøknader] = useState<ISøknadsbehov[]>();
  const [åpenEttersendingMedStønadstype, settÅpenEttersendingMedStønadstype] =
    useState<IÅpenEttersendingMedStønadstype>({
      stønadstype: '',
      åpenEttersending: {
        beskrivelse: '',
        dokumenttype: '',
        vedlegg: [],
      },
    });
  const [senderEttersending, settSenderEttersending] = useState<boolean>(false);
  const [visNoeGikkGalt, settVisNoeGikkGalt] = useState(false);

  const context = useApp();

  useEffect(() => {
    const hentOgSettSøknader = async () => {
      const søknadsliste = await hentDokumentasjonsbehov();

      settSøknader(søknadsliste);
      settLasterverdi(false);
    };
    if (context.søker != null) hentOgSettSøknader();
  }, [context.søker]);

  const sendÅpenEttersendingMedStønadstype = async () => {
    if (!senderEttersending) {
      if (åpenEttersendingMedStønadstype.åpenEttersending.vedlegg.length > 0) {
        settSenderEttersending(true);
        const ettersending = {
          fnr: context.søker.fnr,
          åpenEttersendingMedStønadstype: åpenEttersendingMedStønadstype,
        };
        settVisNoeGikkGalt(false);
        try {
          await sendEttersending(ettersending);
        } catch {
          settVisNoeGikkGalt(true);
        } finally {
          settSenderEttersending(false);
        }
      }
    }
  };

  if (laster) return <NavFrontendSpinner />;

  return (
    <>
      <SoknadContainer>
        <ÅpenEttersending
          visStønadsType={true}
          åpenEttersendingMedStønadstype={åpenEttersendingMedStønadstype}
          settÅpenEttersendingMedStønadstype={
            settÅpenEttersendingMedStønadstype
          }
        />
        <Hovedknapp
          spinner={senderEttersending}
          onClick={() => sendÅpenEttersendingMedStønadstype()}
        >
          {senderEttersending ? 'Sender...' : 'Send inn'}
        </Hovedknapp>
      </SoknadContainer>
      {visNoeGikkGalt && (
        <AlertStripeFeilStyled>Noe gikk galt, prøv igjen</AlertStripeFeilStyled>
      )}
      {søknader.map((søknad, index) => {
        return (
          <SoknadContainer key={index}>
            <h2>
              Søknad om {søknad.stønadType.toLocaleLowerCase()} sendt inn{' '}
              {new Date(søknad.søknadDato).toLocaleDateString()}
            </h2>
            <DokumentasjonsbehovOversikt søknad={søknad} />
          </SoknadContainer>
        );
      })}
    </>
  );
};

export default Søknadsoversikt;
