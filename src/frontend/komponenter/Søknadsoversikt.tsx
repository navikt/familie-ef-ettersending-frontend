import React from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import '../stil/Vedleggsopplaster.less';
import { DokumentasjonsbehovOversikt } from './DokumentasjonsbehovOversikt';
import '../stil/Dokumentasjonsbehov.less';
import { useApp } from '../context/AppContext';
import { hentDokumentasjonsbehov } from '../api-service';
import { useState } from 'react';
import { IDokumentasjonsbehov } from '../typer/dokumentasjonsbehov';
import { useEffect } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { ISøknadsbehov } from '../typer/søknadsdata';

const Søknadsoversikt = () => {
  const [laster, settLasterverdi] = useState(true);
  const [søknader, settSøknader] = useState<ISøknadsbehov[]>();

  const context = useApp();

  // const sendInnDokumentasjon = async () => {
  //   const person = await hentPersoninfo();

  //   if (erDokumentasjonsbehovOppdatert()) {
  //     const ettersendingsdata = {
  //       person: {
  //         søker: person.søker,
  //         barn: [], //TODO må legges in person.barn og fikse typer
  //       },
  //       dokumentasjonsbehov: context.dokumentasjonsbehovTilInnsending,
  //     };
  //     sendEttersending(ettersendingsdata);
  //   }
  //   if (context.åpenEttersendingVedlegg.length > 0) {
  //     const ettersendingsdata = {
  //       person: {
  //         søker: person.søker,
  //         barn: [], //TODO må legges in person.barn og fikse typer
  //       },
  //       opplastedeVedlegg: context.åpenEttersendingVedlegg,
  //     };
  //     sendÅpenEttersending(ettersendingsdata);
  //   }
  // };

  // const erDokumentasjonsbehovOppdatert = () =>
  //   context.dokumentasjonsbehovTilInnsending.filter(
  //     (behov) => behov.opplastedeVedlegg.length > 0
  //   ).length > 0;
  useEffect(() => {
    const hentOgSettSøknader = async () => {
      const søknadsliste = await hentDokumentasjonsbehov(context.søker.fnr);

      settSøknader(søknadsliste);

      console.log('søknadsliste:', søknadsliste);

      settLasterverdi(false);
    };
    if (context.søker != null) hentOgSettSøknader();
  }, [context.søker]);

  if (laster) {
    return <NavFrontendSpinner />;
  }

  return (
    <>
      {/* returnere en DokumentasjonsbehovOversikt per søknad */}
      <DokumentasjonsbehovOversikt søknad={søknader[0]} />
    </>
  );
};

export default Søknadsoversikt;
