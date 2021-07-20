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
  IEttersendingUtenSøknad,
  IEttersending,
} from '../typer/ettersending';
import ÅpenEttersending from './ÅpenEttersending';
import { Hovedknapp } from 'nav-frontend-knapper';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import styled from 'styled-components';

const AlertStripeFeilStyled = styled(AlertStripeFeil)`
  margin-top: 1rem;
`;

const Søknadsoversikt = () => {
  const [laster, settLasterverdi] = useState(true);
  const [søknader, settSøknader] = useState<ISøknadsbehov[]>();
  const [ettersendingUtenSøknad, settEttersendingUtenSøknad] =
    useState<IEttersendingUtenSøknad>({
      stønadstype: '',
      innsending: [],
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

  const sendEttersendingUtenSøknad = async () => {
    if (!senderEttersending) {
      if (ettersendingUtenSøknad.innsending.length > 0) {
        settSenderEttersending(true);
        const ettersending: IEttersending = {
          fnr: context.søker.fnr,
          ettersendingUtenSøknad: ettersendingUtenSøknad,
          ettersendingForSøknad: {
            søknadId: '',
            dokumentasjonsbehov: [],
            innsending: [],
          },
        };
        console.log(ettersending);

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
      <div>
        <ÅpenEttersending
          visStønadstype={true}
          ettersendingUtenSøknad={ettersendingUtenSøknad}
          settEttersendingUtenSøknad={settEttersendingUtenSøknad}
        />
        <Hovedknapp
          spinner={senderEttersending}
          onClick={() => sendEttersendingUtenSøknad()}
        >
          {senderEttersending ? 'Sender...' : 'Send inn'}
        </Hovedknapp>
        {visNoeGikkGalt && (
          <AlertStripeFeilStyled>
            Noe gikk galt, prøv igjen
          </AlertStripeFeilStyled>
        )}
      </div>
      {søknader.map((søknad) => {
        return (
          <>
            <h3>
              Søknad om {søknad.stønadType} sendt inn {søknad.søknadDato}
            </h3>
            <DokumentasjonsbehovOversikt søknad={søknad} />
          </>
        );
      })}
    </>
  );
};

export default Søknadsoversikt;
