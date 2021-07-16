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

  // const lagOgSendEttersending = () => {

  //   // gjøres for hver eksterne opplastning hvordan funker det og hva er de ulike feltene? hvis det ikke er noe data vil det være ingen slike felter. Må også hente denne dataen.
  //   const åpenEttersendingFelt = {
  //     beskrivelse: 'få dette',
  //     dokumenttype: 'skaff dette',
  //     vedlegg: 'fil'
  //   }
  //   // if (erDokumentasjonsbehovOppdatert()) {
  //   const søknadMedVedlegg = {
  //     søknadsId: 'hent dette når det fikses',
  //     dokumentasjonsbehov: dokumentasjonsbehovTilInnsending,
  //     åpenEttersending: åpenEttersendingFelt

  //   }

  //   const ettersendingsdata = {
  //     fnr: context.søker.fnr,
  //     søknadMedVedlegg: søknadMedVedlegg,
  //   }
  //   //denne må endres til å ta imot en ny type ettersending
  //   sendEttersending(ettersendingsdata);
  // }

  // når man legger til ting i behovYilInnsending reagerer denne to ganger, men for slett kun en. Må ta en titt på det å legge til
  useEffect(() => {
    console.log(dokumentasjonsbehovTilInnsending);
  }, [dokumentasjonsbehovTilInnsending]);

  useEffect(() => {
    settDokumentasjonsbehov(søknad.dokumentasjonsbehov);

    const nyListe = søknad.dokumentasjonsbehov.map((behov) => {
      return {
        ...behov,
        opplastedeVedlegg: [],
      };
    });

    settDokumentasjonsbehovTilInnsending(nyListe);
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
        <ÅpenEttersending />
      </div>
      <div>
        {/* <Hovedknapp onClick={() => lagOgSendEttersending()}>Send inn</Hovedknapp> */}
        <Hovedknapp>Send inn</Hovedknapp>
      </div>
    </div>
  );
};
