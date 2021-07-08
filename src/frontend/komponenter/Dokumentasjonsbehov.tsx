import React from 'react';
import { useState } from 'react';
import Krav from './Krav';
import { useEffect } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../context/AppContext';
import { IVedleggMedKrav } from '../typer/søknadsdata';
import { hentDokumentasjonsbehov, hentPersoninfo } from '../api-service';
import { IDokumentasjonsbehovListe } from '../typer/dokumentasjonsbehov';
import axios from 'axios';

export const Dokumentasjonsbehov: React.FC = () => {
  const [dokumentasjonsbehov, settDokumentasjonsbehov] =
    useState<IDokumentasjonsbehovListe[]>(null);
  const [laster, settLasterverdi] = useState(true);

  const context = useApp();

  const sendInnVedlegg = async (dokumenter: IVedleggMedKrav[]) => {
    const person = await hentPersoninfo();

    const dokumentasjonsbehovNy = JSON.parse(
      JSON.stringify(dokumentasjonsbehov)
    );

    if (dokumenter.length > 0) {
      dokumenter.forEach((dokument) => {
        dokumentasjonsbehovNy.forEach((behovListe) => {
          behovListe.dokumentasjonsbehov.forEach((behov) => {
            if (dokument.kravId === behov.id) {
              //Legge til checkbox boolean verdi her

              const idMedNavn = {
                id: '123', //må legges inn dokument.vedlegg.id
                navn: dokument.vedlegg.navn,
              };
              behov.opplastedeVedlegg.push(idMedNavn);
            }
          });
        });
      });
    } else {
      alert('Du he ikkje lasta opp någen vedlegg');
    }

    const godkjentData = {
      person: {
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
      },
      dokumentasjonsbehov: [
        {
          label: 'Dokumentasjon på barnets sykdom',
          id: 'SYKT_BARN',
          harSendtInn: false,
          opplastedeVedlegg: [{ id: '123', navn: 'dokumentnavn1' }],
        },
        {
          label:
            'Dokumentasjon på arbeidsforholdet og årsaken til at du reduserte arbeidstiden',
          id: 'ARBEIDSFORHOLD_REDUSERT_ARBEIDSTID',
          harSendtInn: false,
          opplastedeVedlegg: [{ id: '122', navn: 'dokumentnavn2' }],
        },
      ],
    };

    const personObjekt = {
      søker: person.søker,
      barn: [], // må legges in person.barn og fikse typer
    };

    const ettersendingsdata = {
      person: personObjekt,
      dokumentasjonsbehov: dokumentasjonsbehovNy[0].dokumentasjonsbehov,
    };

    console.log('vår data:');
    console.log(ettersendingsdata);

    console.log('godkjent data');
    console.log(godkjentData);

    axios.post('http://localhost:8091/api/ettersending', ettersendingsdata, {
      withCredentials: true,
    });
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
