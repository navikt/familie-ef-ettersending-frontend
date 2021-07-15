import Dokumentasjonsbehov from './Dokumentasjonsbehov';
import React, { useEffect, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../context/AppContext';
import {
  hentDokumentasjonsbehov,
  hentPersoninfo,
  sendEttersending,
  sendÅpenEttersending,
} from '../api-service';
import ÅpenEttersending from './ÅpenEttersending';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import styled from 'styled-components/macro';

const AlertStripeFeilStyled = styled(AlertStripeFeil)`
  margin-bottom: 1rem;
`;

export const DokumentasjonsbehovOversikt: React.FC = () => {
  const [laster, settLasterverdi] = useState(true);
  const [visNoeGikkGalt, settVisNoeGikkGalt] = useState<boolean>(false);

  const context = useApp();

  const sendInnDokumentasjon = async () => {
    settVisNoeGikkGalt(false);
    try {
      const person = await hentPersoninfo();

      if (erDokumentasjonsbehovOppdatert()) {
        const ettersendingsdata = {
          person: {
            søker: person.søker,
            barn: [], //TODO må legges in person.barn og fikse typer
          },
          dokumentasjonsbehov: context.dokumentasjonsbehovTilInnsending,
        };
        await sendEttersending(ettersendingsdata);
      }
      if (context.åpenEttersendingVedlegg.length > 0) {
        const ettersendingsdata = {
          person: {
            søker: person.søker,
            barn: [], //TODO må legges in person.barn og fikse typer
          },
          opplastedeVedlegg: context.åpenEttersendingVedlegg,
        };
        await sendÅpenEttersending(ettersendingsdata);
      }
    } catch {
      settVisNoeGikkGalt(true);
    }
  };

  const erDokumentasjonsbehovOppdatert = () =>
    context.dokumentasjonsbehovTilInnsending.filter(
      (behov) => behov.opplastedeVedlegg.length > 0
    ).length > 0;
  useEffect(() => {
    const hentOgSettDokumentasjonsbehov = async () => {
      const dokumentasjonsbehovListe = await hentDokumentasjonsbehov(
        context.søker.fnr
      );

      dokumentasjonsbehovListe.forEach((dokumentasjonsbehov) => {
        context.settDokumentasjonsbehov([
          ...context.dokumentasjonsbehov,
          ...dokumentasjonsbehov.dokumentasjonsbehov,
        ]);
        context.settDokumentasjonsbehovTilInnsending([
          ...context.dokumentasjonsbehovTilInnsending,
          ...dokumentasjonsbehov.dokumentasjonsbehov.map((behov) => {
            return { ...behov, opplastedeVedlegg: [] };
          }),
        ]);
      });
      settLasterverdi(false);
    };
    if (context.søker != null) hentOgSettDokumentasjonsbehov();
  }, [context.søker]);

  if (laster) {
    return <NavFrontendSpinner />;
  }

  return (
    <div>
      <div>
        <ÅpenEttersending />
        {context.dokumentasjonsbehov.length > 0 &&
          context.dokumentasjonsbehov.map((behov) => {
            return (
              <Dokumentasjonsbehov key={behov.id} dokumentasjonsbehov={behov} />
            );
          })}
      </div>
      <div>
        {visNoeGikkGalt && (
          <AlertStripeFeilStyled>
            Noe gikk galt, prøv igjen
          </AlertStripeFeilStyled>
        )}
        <Hovedknapp onClick={() => sendInnDokumentasjon()}>Send inn</Hovedknapp>
      </div>
    </div>
  );
};
