import Dokumentasjonsbehov from './Dokumentasjonsbehov';
import React, { useEffect, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../context/AppContext';
import {
  hentDokumentasjonsbehov,
  hentPersoninfo,
  sendEttersending,
} from '../api-service';

export const DokumentasjonsbehovOversikt: React.FC = () => {
  const [laster, settLasterverdi] = useState(true);

  const context = useApp();

  const sendInnDokumentasjon = async () => {
    const person = await hentPersoninfo();

    const ettersendingsdata = {
      person: {
        søker: person.søker,
        barn: [], //TODO må legges in person.barn og fikse typer
      },
      dokumentasjonsbehov: context.dokumentasjonsbehovTilInnsending,
    };
    sendEttersending(ettersendingsdata);
  };

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
        {context.dokumentasjonsbehov.length > 0 &&
          context.dokumentasjonsbehov.map((behov) => {
            return (
              <Dokumentasjonsbehov key={behov.id} dokumentasjonsbehov={behov} />
            );
          })}
      </div>
      <div>
        <Hovedknapp onClick={() => sendInnDokumentasjon()}>Send inn</Hovedknapp>
      </div>
    </div>
  );
};
