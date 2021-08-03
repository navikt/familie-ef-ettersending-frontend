import Dokumentasjonsbehov from './Dokumentasjonsbehov';
import React, { useEffect, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../context/AppContext';
import {
  IEttersending,
  IEttersendingForSøknad,
  IInnsending,
  ISøknadMedEttersendinger,
  IVedlegg,
  tomInnsending,
} from '../typer/ettersending';
import { sendEttersending } from '../api-service';
import { IDokumentasjonsbehov } from '../typer/dokumentasjonsbehov';
import styled from 'styled-components';
import AlertStripe, { alertMelding } from './AlertStripe';
import ÅpenEttersendingForSøknad from './ÅpenEttersendingForSøknad';

const StyledAlertStripe = styled(AlertStripe)`
  margin-top: 1rem;
`;

interface IProps {
  søknad: ISøknadMedEttersendinger;
}

export const DokumentasjonsbehovOversikt: React.FC<IProps> = ({
  søknad,
}: IProps) => {
  const [laster, settLasterverdi] = useState(true);
  const [dokumentasjonsbehov, settDokumentasjonsbehov] = useState<
    IDokumentasjonsbehov[]
  >([]);
  const [
    dokumentasjonsbehovTilInnsending,
    settDokumentasjonsbehovTilInnsending,
  ] = useState<IDokumentasjonsbehov[]>([]);
  const [senderEttersendingSpinner, settSenderEttersendingSpinner] =
    useState<boolean>(false);
  const [alertStripeMelding, settAlertStripeMelding] = useState<alertMelding>(
    alertMelding.TOM
  );
  const [innsending, settInnsending] = useState<IInnsending>(tomInnsending);
  const [innsendingVedleggSendtInn, settInnsendingVedleggSendtInn] = useState<
    IVedlegg[]
  >(
    søknad.innsending
      ? søknad.innsending.flatMap((innsending) => innsending.vedlegg!)
      : []
  );

  const context = useApp();

  const slåSammenDokumentasjonsbehovOgDokumentasjonsbehovTilInnsending =
    (): IDokumentasjonsbehov[] => {
      return dokumentasjonsbehovTilInnsending.map((behov, index) => {
        const vedleggTilInnsendingMedDato = behov.opplastedeVedlegg.map(
          (vedlegg) => {
            return { ...vedlegg, dato: new Date().toString() };
          }
        );
        return {
          ...behov,
          opplastedeVedlegg: [
            ...vedleggTilInnsendingMedDato,
            ...dokumentasjonsbehov[index].opplastedeVedlegg,
          ],
        };
      });
    };

  const erNyeVedlegg = (): boolean => {
    return (
      innsending.vedlegg !== null ||
      dokumentasjonsbehovTilInnsending
        .map((behov) => behov.opplastedeVedlegg.length)
        .reduce((total, verdi) => total + verdi) > 0
    );
  };

  const erNyHarSendtInnTidligere = (): boolean => {
    let erNy = false;
    dokumentasjonsbehovTilInnsending.forEach((behov, index) => {
      if (behov.harSendtInn !== dokumentasjonsbehov[index].harSendtInn) {
        erNy = true;
      }
    });
    return erNy;
  };

  const lagOgSendEttersending = async () => {
    if (
      !senderEttersendingSpinner &&
      (erNyeVedlegg() || erNyHarSendtInnTidligere())
    ) {
      settSenderEttersendingSpinner(true);

      const ettersendingForSøknad: IEttersendingForSøknad = {
        søknadId: søknad.søknadId,
        dokumentasjonsbehov: dokumentasjonsbehovTilInnsending,
        innsending: innsending.vedlegg ? [innsending] : [],
      };

      const ettersendingsdata: IEttersending = {
        fnr: context.søker!.fnr,
        stønadType: søknad.stønadType,
        ettersendingUtenSøknad: null,
        ettersendingForSøknad: ettersendingForSøknad,
      };

      settAlertStripeMelding(alertMelding.TOM);
      try {
        await sendEttersending(ettersendingsdata);
        settAlertStripeMelding(alertMelding.SENDT_INN);
        settDokumentasjonsbehov(
          slåSammenDokumentasjonsbehovOgDokumentasjonsbehovTilInnsending()
        );
        settDokumentasjonsbehovTilInnsending(
          lagDokumentasjonsbehovTilInnsending(
            slåSammenDokumentasjonsbehovOgDokumentasjonsbehovTilInnsending()
          )
        );
        innsending.vedlegg &&
          settInnsendingVedleggSendtInn([
            ...innsendingVedleggSendtInn,
            {
              ...innsending.vedlegg,
              dato: new Date().toString(),
              beskrivelse: innsending.beskrivelse,
              dokumenttype: innsending.dokumenttype,
            },
          ]);
        settInnsending(tomInnsending);
      } catch {
        settAlertStripeMelding(alertMelding.FEIL);
      } finally {
        settSenderEttersendingSpinner(false);
      }
    }
  };

  const lagDokumentasjonsbehovTilInnsending = (
    dokumentasjonsbehov: IDokumentasjonsbehov[]
  ): IDokumentasjonsbehov[] => {
    return dokumentasjonsbehov.map((behov) => {
      return {
        ...behov,
        opplastedeVedlegg: [],
      };
    });
  };

  useEffect(() => {
    settDokumentasjonsbehov(søknad.dokumentasjonsbehov);
    settDokumentasjonsbehovTilInnsending(
      lagDokumentasjonsbehovTilInnsending(søknad.dokumentasjonsbehov)
    );
    settLasterverdi(false);
  }, [context.søker]);

  if (laster) {
    return <NavFrontendSpinner />;
  }

  return (
    <>
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
      <ÅpenEttersendingForSøknad
        settInnsending={settInnsending}
        innsending={innsending}
        tidligereOpplastedeVedlegg={innsendingVedleggSendtInn}
      />
      <Hovedknapp
        spinner={senderEttersendingSpinner}
        onClick={lagOgSendEttersending}
      >
        {senderEttersendingSpinner ? 'Sender...' : 'Send inn'}
      </Hovedknapp>
      <StyledAlertStripe melding={alertStripeMelding} />
    </>
  );
};
