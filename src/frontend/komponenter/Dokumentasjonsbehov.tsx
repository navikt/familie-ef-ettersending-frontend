import React from 'react';
import { useState } from 'react';
import Krav from './Krav';
import { useEffect } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../context/AppContext';
import { IVedleggMedKrav } from '../typer/søknadsdata';
import { hentDokumentasjonsbehov } from '../api-service';
import { IDokumentasjonsbehovListe } from '../typer/dokumentasjonsbehov';

export const Dokumentasjonsbehov: React.FC = () => {
  const [dokumentasjonsbehov, settDokumentasjonsbehov] =
    useState<IDokumentasjonsbehovListe[]>(null);
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

    /*
    const dokumentasjonsbehovNy = { ...dokumentasjonsbehov };

    */

    const dokumentasjonsbehovNy = JSON.parse(
      JSON.stringify(dokumentasjonsbehov)
    );

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
      const dokumenter = await hentDokumentasjonsbehov(context.søker.fnr);
      settDokumentasjonsbehov(dokumenter);
      settLasterverdi(false);
    };
    if (context.søker != null) hentOgSettDokumentasjonsbehov();
  }, [context.søker]);

  if (laster) {
    return <NavFrontendSpinner />;
  }

  dokumentasjonsbehov.dokumentasjonsbehov.map((behov) => {
    console.log(behov.opplastedeVedlegg);
  });

  return (
    <div>
      <div>
        {dokumentasjonsbehov &&
          dokumentasjonsbehov.map((behovPerSøknad) => {
            return behovPerSøknad.dokumentasjonsbehov.map((behov) => {
              return <Krav key={behov.id} dokumentasjonsbehov={behov} />;
            });
          })}
      </div>
      <div>
        <Hovedknapp onClick={() => sendInnVedlegg(context.vedleggMedKrav)}>
          Send inn
        </Hovedknapp>
      </div>
    </div>
  );
};
