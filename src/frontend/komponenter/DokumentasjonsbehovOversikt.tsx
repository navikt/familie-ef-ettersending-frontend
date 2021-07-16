import Dokumentasjonsbehov from './Dokumentasjonsbehov';
import React, { useEffect, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../context/AppContext';
import { ISøknadsbehov, IVedlegg } from '../typer/søknadsdata';
import { sendEttersending } from '../api-service';
import ÅpenEttersending from './ÅpenEttersending';
import { IDokumentasjonsbehov } from '../typer/dokumentasjonsbehov';

//Herfra skal søknadsdataen for post request ettersending lages og sendes (fordi vi her har en søknadsid + dokumentasjonsbehov og liste med dokumenter per)

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

  // se på dette. prøv å hent selve feltet fra åpenettersending
  const [åpenEttersendingFelt, settÅpenEttersendingFelt] = useState<any[]>();

  const context = useApp();

  const lagOgSendEttersending = () => {
    const søknadMedVedlegg = {
      søknadsId: søknad.søknadId,
      dokumentasjonsbehov: dokumentasjonsbehovTilInnsending,
      åpenEttersending: åpenEttersendingFelt,
    };
    const ettersendingsdata = {
      fnr: context.søker.fnr,
      søknadMedVedlegg: søknadMedVedlegg,
    };
    // sjekk at "sendEttersending" peker på riktig sted og at formatet er rett
    sendEttersending(ettersendingsdata);
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
        {/* deal med denne */}
        <ÅpenEttersending />
      </div>
      <div>
        <Hovedknapp onClick={() => lagOgSendEttersending()}>
          Send inn
        </Hovedknapp>
      </div>
    </div>
  );
};
