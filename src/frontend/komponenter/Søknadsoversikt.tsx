import React from 'react';
import '../stil/Vedleggsopplaster.less';
import { DokumentasjonsbehovOversikt } from './DokumentasjonsbehovOversikt';
import { useApp } from '../context/AppContext';
import {
  hentDokumentasjonsbehov,
  hentEttersendinger,
  sendEttersending,
} from '../api-service';
import { useState } from 'react';
import { useEffect } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import {
  IEttersendingUtenSøknad,
  tomEttersendingUtenSøknad,
  IVedlegg,
  IEttersendingTilInnsending,
  ISøknadMedEttersendinger,
} from '../typer/ettersending';
import { Hovedknapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import AlertStripe, { alertMelding } from './AlertStripe';
import ÅpenEttersendingUtenSøknad from './ÅpenEttersendingUtenSøknad';

const SoknadContainer = styled.div`
  margin-bottom: 5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid lightgray;
`;

const StyledAlertStripe = styled(AlertStripe)`
  margin-top: 1rem;
`;

const Søknadsoversikt: React.FC = () => {
  const [laster, settLasterverdi] = useState(true);
  const [søknaderMedEttersendinger, settSøknaderMedEttersendinger] = useState<
    ISøknadMedEttersendinger[]
  >([]);
  const [ettersendingUtenSøknad, settEttersendingUtenSøknad] =
    useState<IEttersendingUtenSøknad>(tomEttersendingUtenSøknad);
  const [senderEttersending, settSenderEttersending] = useState<boolean>(false);
  const [alertStripeMelding, settAlertStripeMelding] = useState<alertMelding>(
    alertMelding.TOM
  );
  const [innsendingVedleggSendtInn, settInnsendingVedleggSendtInn] = useState<
    IVedlegg[]
  >([]);

  const context = useApp();

  useEffect(() => {
    const hentOgSettSøknaderOgEttersendinger = async () => {
      const søknadsliste = await hentDokumentasjonsbehov();
      const ettersendinger = await hentEttersendinger();

      const søknaderMedEttersendinger: ISøknadMedEttersendinger[] =
        søknadsliste.map((søknad) => {
          const ettersendingForSøknad = ettersendinger.filter(
            (ettersendingMedDato) =>
              ettersendingMedDato.ettersending.ettersendingForSøknad &&
              ettersendingMedDato.ettersending.ettersendingForSøknad
                .søknadId === søknad.søknadId
          );
          const ettersendingDokumentasjonsbehov = ettersendingForSøknad.flatMap(
            (ettersendingMedDato) =>
              ettersendingMedDato.ettersending.ettersendingForSøknad!
                .dokumentasjonsbehov
          );
          const ettersendingInnsending = ettersendingForSøknad.flatMap(
            (ettersendingMedDato) =>
              ettersendingMedDato.ettersending.ettersendingForSøknad!.innsending
          );
          const dokumentasjonsbehov =
            søknad.dokumentasjonsbehov.dokumentasjonsbehov.map((behov) => {
              const ettersendingBehov = ettersendingDokumentasjonsbehov.filter(
                (ettersendingBehov) => ettersendingBehov.id === behov.id
              );
              const ettersendingBehovVedlegg = ettersendingBehov.flatMap(
                (behov) => behov.opplastedeVedlegg
              );
              const ettersenidngHarSendtInnTidligere = ettersendingBehov.some(
                (behov) => behov.harSendtInn
              );
              if (ettersendingBehov.length > 0) {
                return {
                  ...behov,
                  harSendtInn:
                    behov.harSendtInn || ettersenidngHarSendtInnTidligere,
                  opplastedeVedlegg: [
                    ...behov.opplastedeVedlegg,
                    ...ettersendingBehovVedlegg,
                  ],
                  innsending: [],
                };
              }
              return behov;
            });
          return {
            ...søknad,
            dokumentasjonsbehov: dokumentasjonsbehov,
            innsending: ettersendingInnsending,
          };
        });

      const innsendingVedleggSendtInn: IVedlegg[] = ettersendinger
        .filter(
          (ettersendingMedDato) =>
            ettersendingMedDato.ettersending.ettersendingUtenSøknad !== null
        )
        .flatMap((ettersendingMedDato) =>
          ettersendingMedDato.ettersending.ettersendingUtenSøknad!.innsending.flatMap(
            (innsending) => innsending.vedlegg!
          )
        );

      settSøknaderMedEttersendinger(søknaderMedEttersendinger);
      settInnsendingVedleggSendtInn(innsendingVedleggSendtInn);
      settLasterverdi(false);
    };
    if (context.søker != null) hentOgSettSøknaderOgEttersendinger();
  }, [context.søker]);

  const sendEttersendingUtenSøknad = async () => {
    if (!senderEttersending && ettersendingUtenSøknad.innsending[0].vedlegg) {
      settSenderEttersending(true);

      let ettersending: IEttersendingTilInnsending = {
        fnr: context.søker!.fnr,
        ettersendingUtenSøknad: ettersendingUtenSøknad,
        ettersendingForSøknad: null,
      };

      if (ettersendingUtenSøknad.stønadstype === '') {
        ettersending = { ...ettersending, ettersendingUtenSøknad: null };
      }

      settAlertStripeMelding(alertMelding.TOM);
      try {
        await sendEttersending(ettersending);
        settInnsendingVedleggSendtInn([
          ...innsendingVedleggSendtInn,
          ettersendingUtenSøknad.innsending[0].vedlegg,
        ]);
        settEttersendingUtenSøknad(tomEttersendingUtenSøknad);
        settAlertStripeMelding(alertMelding.SENDT_INN);
      } catch {
        settAlertStripeMelding(alertMelding.FEIL);
      } finally {
        settSenderEttersending(false);
      }
    }
  };

  if (laster) return <NavFrontendSpinner />;

  return (
    <>
      <SoknadContainer>
        <ÅpenEttersendingUtenSøknad
          ettersendingUtenSøknad={ettersendingUtenSøknad}
          settEttersendingUtenSøknad={settEttersendingUtenSøknad}
          tidligereOpplastedeVedlegg={innsendingVedleggSendtInn}
        />
        <Hovedknapp
          spinner={senderEttersending}
          onClick={() => sendEttersendingUtenSøknad()}
        >
          {senderEttersending ? 'Sender...' : 'Send inn'}
        </Hovedknapp>
        <StyledAlertStripe melding={alertStripeMelding} />
      </SoknadContainer>
      {søknaderMedEttersendinger.map((søknad, index) => {
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
