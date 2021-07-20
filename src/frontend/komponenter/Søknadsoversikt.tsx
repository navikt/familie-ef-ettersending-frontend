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
import styled from 'styled-components';
import AlertStripe, { alertMelding } from './AlertStripe';

const StyledAlertStripe = styled(AlertStripe)`
  margin-top: 1rem;
`;

const Søknadsoversikt = () => {
  const [laster, settLasterverdi] = useState(true);
  const [søknader, settSøknader] = useState<ISøknadsbehov[]>();
  const [alertStripeMelding, settAlertStripeMelding] = useState<alertMelding>(
    alertMelding.TOM
  );
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

  const sendÅpenEttersendingMedStønadstype = async () => {
    const ettersending = {
      fnr: context.søker.fnr,
      åpenEttersendingMedStønadstype: åpenEttersendingMedStønadstype,
    };
    if (åpenEttersendingMedStønadstype.åpenEttersending.vedlegg.length > 0)
      try {
        await sendEttersending(ettersending);
        settAlertStripeMelding(alertMelding.SENDTINN);
      } catch {
        settAlertStripeMelding(alertMelding.FEIL);
      }
  };

  if (laster) return <NavFrontendSpinner />;

  return (
    <>
      <div>
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
        <StyledAlertStripe melding={alertStripeMelding} />
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
