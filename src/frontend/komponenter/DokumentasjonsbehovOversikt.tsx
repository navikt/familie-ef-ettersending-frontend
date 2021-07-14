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
import { IDokumentasjonsbehovListe } from '../typer/dokumentasjonsbehov';

export const DokumentasjonsbehovOversikt: React.FC = () => {
  const [dokumentasjonsbehov, settDokumentasjonsbehov] =
    useState<IDokumentasjonsbehovListe[]>(null);
  const [laster, settLasterverdi] = useState(true);

  const context = useApp();

  const sendInnDokumentasjon = async () => {
    const person = await hentPersoninfo();

    const ettersendingsdata = {
      person: {
        søker: person.søker,
        barn: [], // må legges in person.barn og fikse typer
      },
      dokumentasjonsbehov: context.dokumentasjonsbehov,
    };
    sendEttersending(ettersendingsdata);
  };

  useEffect(() => {
    const hentOgSettDokumentasjonsbehov = async () => {
      const dokumentasjonsbehovListe = await hentDokumentasjonsbehov(
        context.søker.fnr
      );
      settDokumentasjonsbehov(dokumentasjonsbehovListe);

      dokumentasjonsbehovListe.forEach((dokumentasjonsbehov) => {
        context.dokumentasjonsbehov
          ? context.settDokumentasjonsbehov([
              ...context.dokumentasjonsbehov,
              ...dokumentasjonsbehov.dokumentasjonsbehov,
            ])
          : context.settDokumentasjonsbehov(
              dokumentasjonsbehov.dokumentasjonsbehov
            );
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
        {dokumentasjonsbehov &&
          dokumentasjonsbehov.map((behovPerSøknad) => {
            return behovPerSøknad.dokumentasjonsbehov.map((behov) => {
              return (
                <Dokumentasjonsbehov
                  key={behov.id}
                  dokumentasjonsbehov={behov}
                />
              );
            });
          })}
      </div>
      <div>
        <Hovedknapp onClick={() => sendInnDokumentasjon()}>Send inn</Hovedknapp>
      </div>
    </div>
  );
};
