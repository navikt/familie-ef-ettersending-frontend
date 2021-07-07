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
  const [laster, settLasterverdi] = useState(true);

  const context = useApp();

  const sendInnVedlegg = (dokumenter: IVedleggMedKrav[]) => {
    console.log(dokumenter);
  };
  useEffect(() => {
    const hentOgSettDokumentasjonsbehov = async () => {
      settDokumentasjonsbehov(await hentDokumentasjonsbehov());
      settLasterverdi(false);
    };
    hentOgSettDokumentasjonsbehov();
  }, []);

  if (laster) {
    return <NavFrontendSpinner />;
  }

  return (
    <div>
      <div>
        {dokumentasjonsbehov.dokumentasjonsbehov.map((behov) => (
          <Krav key={behov.id} dokumentasjonsbehov={behov} />
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
