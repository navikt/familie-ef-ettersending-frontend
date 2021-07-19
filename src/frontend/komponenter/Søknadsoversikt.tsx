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

const SoknadContainer = styled.div`
  margin-bottom: 5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid lightgray;
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

  const context = useApp();

  useEffect(() => {
    const hentOgSettSøknader = async () => {
      const søknadsliste = await hentDokumentasjonsbehov();

      settSøknader(søknadsliste);
      settLasterverdi(false);
    };
    if (context.søker != null) hentOgSettSøknader();
  }, [context.søker]);

  const sendÅpenEttersendingMedStønadstype = () => {
    const ettersending = {
      fnr: context.søker.fnr,
      åpenEttersendingMedStønadstype: åpenEttersendingMedStønadstype,
    };
    if (åpenEttersendingMedStønadstype.åpenEttersending.vedlegg.length > 0)
      sendEttersending(ettersending);
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
        <Hovedknapp onClick={() => sendÅpenEttersendingMedStønadstype()}>
          Send inn
        </Hovedknapp>
      </SoknadContainer>
      {søknader.map((søknad, index) => {
        return (
          <SoknadContainer key={index}>
            <h3>
              Søknad om {søknad.stønadType} sendt inn {søknad.søknadDato}
            </h3>
            <DokumentasjonsbehovOversikt søknad={søknad} />
          </SoknadContainer>
        );
      })}
    </>
  );
};

export default Søknadsoversikt;
