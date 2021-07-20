import Dokumentasjonsbehov from './Dokumentasjonsbehov';
import React, { useEffect, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../context/AppContext';
import { ISøknadsbehov, IÅpenEttersending } from '../typer/søknadsdata';
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
  ] = useState<IDokumentasjonsbehov[]>([]);
  const [alertStripeMelding, settAlertStripeMelding] = useState<alertMelding>(
    alertMelding.TOM
  );
  const [senderEttersending, settSenderEttersending] = useState<boolean>(false);

  const [åpenEttersendingFelt, settÅpenEttersendingFelt] =
    useState<IÅpenEttersending>({
      beskrivelse: '',
      dokumenttype: '',
      vedlegg: [],
    });

  const context = useApp();

  const lagOgSendEttersending = async () => {
    if (!senderEttersending) {
      if (
        åpenEttersendingFelt.vedlegg.length > 0 ||
        dokumentasjonsbehovTilInnsending
          .map((behov) => behov.opplastedeVedlegg.length)
          .reduce((total, verdi) => total + verdi) > 0
      ) {
        settSenderEttersending(true);
        const søknadMedVedlegg = {
          søknadsId: søknad.søknadId,
          dokumentasjonsbehov: dokumentasjonsbehovTilInnsending,
          åpenEttersending: åpenEttersendingFelt,
        };
        const ettersendingsdata = {
          fnr: context.søker.fnr,
          søknadMedVedlegg: søknadMedVedlegg,
        };
        settAlertStripeMelding(alertMelding.TOM);
        try {
          await sendEttersending(ettersendingsdata);
          settDokumentasjonsbehov([
            ...dokumentasjonsbehov,
            ...dokumentasjonsbehovTilInnsending,
          ]);
          settDokumentasjonsbehovTilInnsending([]);
          settAlertStripeMelding(alertMelding.SENDT_INN);
        } catch {
          settAlertStripeMelding(alertMelding.FEIL);
        } finally {
          settSenderEttersending(false);
        }
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
          settÅpenEttersendingFelt={settÅpenEttersendingFelt}
          åpenEttersendingFelt={åpenEttersendingFelt}
        />
      </div>
      <div>
        <Hovedknapp
          spinner={senderEttersending}
          onClick={() => lagOgSendEttersending()}
        >
          {senderEttersending ? 'Sender...' : 'Send inn'}
        </Hovedknapp>
        <StyledAlertStripe melding={alertStripeMelding} />
      </div>
    </div>
  );
};
