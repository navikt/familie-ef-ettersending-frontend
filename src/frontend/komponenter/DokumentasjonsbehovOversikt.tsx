import Dokumentasjonsbehov from './Dokumentasjonsbehov';
import React, { useEffect, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../context/AppContext';
import { ISøknadsbehov } from '../typer/søknadsdata';

import {
  hentPersoninfo,
  sendEttersending,
  sendÅpenEttersending,
} from '../api-service';

import ÅpenEttersending from './ÅpenEttersending';
import { IDokumentasjonsbehov } from '../typer/dokumentasjonsbehov';

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

  const context = useApp();

  //TODO: her starter delen som må skrives om
  const sendInnDokumentasjon = async () => {
    const person = await hentPersoninfo();

    if (erDokumentasjonsbehovOppdatert()) {
      const ettersendingsdata = {
        person: {
          søker: person.søker,
          barn: [], //TODO må legges in person.barn og fikse typer
        },
        dokumentasjonsbehov: context.dokumentasjonsbehovTilInnsending,
      };
      sendEttersending(ettersendingsdata);
    }
    if (context.åpenEttersendingVedlegg.length > 0) {
      const ettersendingsdata = {
        person: {
          søker: person.søker,
          barn: [], //TODO må legges in person.barn og fikse typer
        },
        opplastedeVedlegg: context.åpenEttersendingVedlegg,
      };
      sendÅpenEttersending(ettersendingsdata);
    }
  };

  const erDokumentasjonsbehovOppdatert = () =>
    context.dokumentasjonsbehovTilInnsending.filter(
      (behov) => behov.opplastedeVedlegg.length > 0
    ).length > 0;

  //HER slutter delen

  useEffect(() => {
    console.log(søknad.dokumentasjonsbehov);
    settDokumentasjonsbehov(søknad.dokumentasjonsbehov);
    settDokumentasjonsbehovTilInnsending(søknad.dokumentasjonsbehov); //må fikse sånn at "opplastedeVedlegg" i doktilInnsending er tom
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
              <Dokumentasjonsbehov key={behov.id} dokumentasjonsbehov={behov} />
            );
          })}
        <ÅpenEttersending />
      </div>
      <div>
        <Hovedknapp onClick={() => sendInnDokumentasjon()}>Send inn</Hovedknapp>
      </div>
    </div>
  );
};
