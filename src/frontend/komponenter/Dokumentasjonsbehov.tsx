import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import Krav from './Krav';
import { useEffect } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../context/AppContext';
import { IVedleggMedKrav } from '../typer/søknadsdata';
import { hentDokumentasjonsbehov } from '../api-service';

export const Dokumentasjonsbehov: React.FC = () => {
  const [dokumentasjonsbehov, settDokumentasjonsbehov] = useState(null);
  const [laster, settLaster] = useState(true);

  const context = useApp();

  const sendInnVedlegg = (dokumenter: IVedleggMedKrav[]) => {
    console.log(dokumenter);
  };
  useEffect(() => {
    const hentOgSettDokumentasjonsbehov = async () => {
      settDokumentasjonsbehov(await hentDokumentasjonsbehov());
      settLaster(false);
    };
    hentOgSettDokumentasjonsbehov();
  }, []);

  if (laster) {
    return <NavFrontendSpinner />;
  }

  return (
    <div>
      <div>
        {dokumentasjonsbehov.dokumentasjonsbehov.map((krav) => (
          <Krav key={krav.id} krav={krav} />
        ))}
      </div>
      <div>
        <Hovedknapp onClick={() => sendInnVedlegg(context.vedleggMedKrav)}>
          Send inn
        </Hovedknapp>
      </div>
    </div>
  );
};
