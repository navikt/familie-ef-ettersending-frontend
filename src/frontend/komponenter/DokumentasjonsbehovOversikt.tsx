import Dokumentasjonsbehov from './Dokumentasjonsbehov';
import React, { useEffect, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../context/AppContext';
import { IVedleggMedKrav } from '../typer/søknadsdata';
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

  const sendInnVedlegg = async (dokumenter: IVedleggMedKrav[]) => {
    const person = await hentPersoninfo();

    const dokumentasjonsbehovKopi = JSON.parse(
      JSON.stringify(dokumentasjonsbehov)
    );

    if (dokumenter.length > 0) {
      dokumenter.forEach((dokument) => {
        dokumentasjonsbehovKopi.forEach((behovListe) => {
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
      alert('Nå må kje du varta graudnauden diu');
    }

    const personObjekt = {
      søker: person.søker,
      barn: [], // må legges in person.barn og fikse typer
    };

    const ettersendingsdata = {
      person: personObjekt,
      dokumentasjonsbehov: dokumentasjonsbehovKopi[0].dokumentasjonsbehov,
    };

    console.log(ettersendingsdata.dokumentasjonsbehov);
    console.log(personObjekt);

    const respons = await sendEttersending(ettersendingsdata);

    console.log(respons);
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
        <Hovedknapp onClick={() => sendInnVedlegg(context.vedleggMedKrav)}>
          Send inn
        </Hovedknapp>
      </div>
    </div>
  );
};
