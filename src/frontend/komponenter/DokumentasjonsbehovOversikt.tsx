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
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

const AlertStripeFeilStyled = styled(AlertStripeFeil)`
  margin-top: 1rem;
`;

interface IProps {
  søknad: ISøknadsbehov;
}

export const DokumentasjonsbehovOversikt = ({ søknad }: IProps) => {
  const [laster, settLasterverdi] = useState(true);
  const [dokumentasjonsbehov, settDokumentasjonsbehov] =
    useState<IDokumentasjonsbehov[]>();
  const [
    dokumentasjonsbehovTilInnsending,
    settDokumentasjonsbehovTilInnsending,
  ] = useState<IDokumentasjonsbehov[]>();
  const [senderEttersendingSpinner, settSenderEttersendingSpinner] =
    useState<boolean>(false);
  const [visNoeGikkGalt, settVisNoeGikkGalt] = useState(false);

  const [åpenEttersendingMedSøknad, settÅpenEttersendingMedSøknad] =
    useState<IÅpenEttersending>({
      beskrivelse: '',
      dokumenttype: '',
      vedlegg: null,
    });

  const context = useApp();

  const lagOgSendEttersending = async () => {
    if (!senderEttersendingSpinner) {
      if (
        !åpenEttersendingMedSøknad.vedlegg ||
        dokumentasjonsbehovTilInnsending
          .map((behov) => behov.opplastedeVedlegg.length)
          .reduce((total, verdi) => total + verdi) > 0
      ) {
        settSenderEttersendingSpinner(true);
        const søknadMedVedlegg = {
          søknadsId: søknad.søknadId,
          dokumentasjonsbehov: dokumentasjonsbehovTilInnsending,
          åpenEttersending: åpenEttersendingMedSøknad.vedlegg
            ? åpenEttersendingMedSøknad
            : [],
        };
        const ettersendingsdata = {
          fnr: context.søker.fnr,
          søknadMedVedlegg: søknadMedVedlegg,
        };
        settVisNoeGikkGalt(false);
        try {
          await sendEttersending(ettersendingsdata);
        } catch {
          settVisNoeGikkGalt(true);
        } finally {
          settSenderEttersendingSpinner(false);
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
          settÅpenEttersendingMedSøknad={settÅpenEttersendingMedSøknad}
          åpenEttersendingMedSøknad={åpenEttersendingMedSøknad}
        />
      </div>
      <div>
        <Hovedknapp
          spinner={senderEttersendingSpinner}
          onClick={() => lagOgSendEttersending()}
        >
          {senderEttersendingSpinner ? 'Sender...' : 'Send inn'}
        </Hovedknapp>
        {visNoeGikkGalt && (
          <AlertStripeFeilStyled>
            Noe gikk galt, prøv igjen
          </AlertStripeFeilStyled>
        )}
      </div>
    </div>
  );
};
