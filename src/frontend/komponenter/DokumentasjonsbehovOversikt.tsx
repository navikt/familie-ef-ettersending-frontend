import Dokumentasjonsbehov from './Dokumentasjonsbehov';
import React, { useEffect, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../context/AppContext';
import {
  IEttersending,
  IEttersendingForSøknad,
  IInnsending,
  ISøknadsbehov,
  tomInnsending,
} from '../typer/ettersending';
import { sendEttersending } from '../api-service';
import ÅpenEttersending from './ÅpenEttersending';
import { IDokumentasjonsbehov } from '../typer/dokumentasjonsbehov';
import styled from 'styled-components';
import AlertStripe, { alertMelding } from './AlertStripe';

const StyledAlertStripe = styled(AlertStripe)`
  margin-top: 1rem;
`;

interface IProps {
  søknad: ISøknadsbehov;
}

export const DokumentasjonsbehovOversikt = ({ søknad }: IProps) => {
  const [laster, settLasterverdi] = useState(true);
  const [dokumentasjonsbehov, settDokumentasjonsbehov] = useState<
    IDokumentasjonsbehov[]
  >([]);
  const [
    dokumentasjonsbehovTilInnsending,
    settDokumentasjonsbehovTilInnsending,
  ] = useState<IDokumentasjonsbehov[]>();
  const [senderEttersendingSpinner, settSenderEttersendingSpinner] =
    useState<boolean>(false);
  const [alertStripeMelding, settAlertStripeMelding] = useState<alertMelding>(
    alertMelding.TOM
  );
  const [innsending, settInnsending] = useState<IInnsending>(tomInnsending);

  const context = useApp();

  const lagOgSendEttersending = async () => {
    if (
      !senderEttersendingSpinner &&
      (innsending.vedlegg ||
        dokumentasjonsbehovTilInnsending
          .map((behov) => behov.opplastedeVedlegg.length)
          .reduce((total, verdi) => total + verdi) > 0)
    ) {
      settSenderEttersendingSpinner(true);

      const ettersendingForSøknad: IEttersendingForSøknad = {
        søknadId: søknad.søknadId,
        dokumentasjonsbehov: dokumentasjonsbehovTilInnsending,
        innsending: innsending.vedlegg ? [innsending] : [],
      };

      const ettersendingsdata: IEttersending = {
        fnr: context.søker.fnr,
        ettersendingUtenSøknad: null,
        ettersendingForSøknad: ettersendingForSøknad,
      };

      settAlertStripeMelding(alertMelding.TOM);
      try {
        await sendEttersending(ettersendingsdata);
        settAlertStripeMelding(alertMelding.SENDT_INN);
      } catch {
        settAlertStripeMelding(alertMelding.FEIL);
      } finally {
        settSenderEttersendingSpinner(false);
      }
    }
  };

  useEffect(() => {
    settDokumentasjonsbehov(søknad.dokumentasjonsbehov.dokumentasjonsbehov);

    const oppdatertDokumentasjonsbehov =
      søknad.dokumentasjonsbehov.dokumentasjonsbehov.map((behov) => {
        return {
          ...behov,
          opplastedeVedlegg: [],
        };
      });

    settDokumentasjonsbehovTilInnsending(oppdatertDokumentasjonsbehov);
    settLasterverdi(false);
  }, [context.søker]);

  if (laster) {
    return <NavFrontendSpinner />;
  }

  return (
    <div>
      <div>
        {dokumentasjonsbehov.length > 0 &&
          dokumentasjonsbehov.map((behov) => {
            return (
              <Dokumentasjonsbehov
                key={behov.id}
                dokumentasjonsbehov={behov}
                dokumentasjonsbehovTilInnsending={
                  dokumentasjonsbehovTilInnsending
                }
                settDokumentasjonsbehovTilInnsending={
                  settDokumentasjonsbehovTilInnsending
                }
              />
            );
          })}
        <ÅpenEttersending
          settInnsending={settInnsending}
          innsending={innsending}
        />
      </div>
      <div>
        <Hovedknapp
          spinner={senderEttersendingSpinner}
          onClick={lagOgSendEttersending}
        >
          {senderEttersendingSpinner ? 'Sender...' : 'Send inn'}
        </Hovedknapp>
        <StyledAlertStripe melding={alertStripeMelding} />
      </div>
    </div>
  );
};
