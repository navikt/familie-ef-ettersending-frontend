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

    const person = {
      barn: [],
      søker: {
        adresse: {
          adresse: 'addresse 1',
          postnummer: '3030',
          poststed: 'oslo',
        },
        egenansatt: false,
        fnr: '01010172272',
        forkortetNavn: 'Sigmund',
        sivilstand: 'ugift',
        statsborgerskap: 'norsk',
      },
    };

    const dokumentasjonsbehovNy = { ...dokumentasjonsbehov };

    if (dokumenter.length > 0) {
      dokumenter.forEach((dokument) => {
        dokumentasjonsbehovNy.dokumentasjonsbehov.forEach((behov) => {
          if (dokument.kravId === behov.id) {
            const idMedNavn = {
              dokumentId: dokument.vedlegg.dokumentId,
              navn: dokument.vedlegg.navn,
            };
            behov.opplastedeVedlegg.push(idMedNavn);
          }
        });
      });
    } else {
      alert('Du he ikkje lasta opp någen vedlegg');
    }

    console.log(dokumentasjonsbehovNy);
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
