import React from 'react';
import '../stil/Vedleggsopplaster.less';
import { DokumentasjonsbehovOversikt } from './DokumentasjonsbehovOversikt';
import { useApp } from '../context/AppContext';
import { hentDokumentasjonsbehov, sendEttersending } from '../api-service';
import { useState } from 'react';
import { useEffect } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import {
  ISøknadsbehov,
  IÅpenEttersendingMedStønadstype,
} from '../typer/søknadsdata';
import ÅpenEttersending from './ÅpenEttersending';
import { Hovedknapp } from 'nav-frontend-knapper';

const Søknadsoversikt = () => {
  const [laster, settLasterverdi] = useState(true);
  const [søknader, settSøknader] = useState<ISøknadsbehov[]>();
  const [åpenEttersendingMedStønadstype, settÅpenEttersendingMedStønadstype] =
    useState<IÅpenEttersendingMedStønadstype>({
      stønadstype: '',
      åpenEttersending: {
        beskrivelse: '',
        dokumenttype: '',
        vedlegg: [],
      },
    });
  const [senderEttersending, settSenderEttersending] = useState<boolean>(false);

  const context = useApp();

  useEffect(() => {
    const hentOgSettSøknader = async () => {
      const søknadsliste = await hentDokumentasjonsbehov();

      settSøknader(søknadsliste);
      settLasterverdi(false);
    };
    if (context.søker != null) hentOgSettSøknader();
  }, [context.søker]);

  const sendÅpenEttersendingMedStønadstype = async () => {
    if (!senderEttersending) {
      settSenderEttersending(true);
      const ettersending = {
        fnr: context.søker.fnr,
        åpenEttersendingMedStønadstype: åpenEttersendingMedStønadstype,
      };
      if (åpenEttersendingMedStønadstype.åpenEttersending.vedlegg.length > 0) {
        const responsEttersending = await sendEttersending(ettersending);
        if (responsEttersending) {
          //kan man teste på denne måten?
          settSenderEttersending(false);
        }
      }
    }
  };

  if (laster) return <NavFrontendSpinner />;

  return (
    <>
      <div>
        <ÅpenEttersending
          visStønadsType={true}
          åpenEttersendingMedStønadstype={åpenEttersendingMedStønadstype}
          settÅpenEttersendingMedStønadstype={
            settÅpenEttersendingMedStønadstype
          }
        />
        <Hovedknapp
          spinner={senderEttersending}
          onClick={() => sendÅpenEttersendingMedStønadstype()}
        >
          {senderEttersending ? 'Sender...' : 'Send inn'}
        </Hovedknapp>
      </div>
      {søknader.map((søknad) => {
        return (
          <>
            <h3>
              Søknad om {søknad.stønadType} sendt inn {søknad.søknadDato}
            </h3>
            <DokumentasjonsbehovOversikt søknad={søknad} />
          </>
        );
      })}
    </>
  );
};

export default Søknadsoversikt;
