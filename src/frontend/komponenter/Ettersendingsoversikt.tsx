import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  hentSøknader,
  hentEttersendinger,
  sendEttersending,
} from '../api-service';
import {
  minstEttVedleggErLastetOpp,
  minstEnBoksErAvkrysset,
  minstEttVedleggErLastetOppForEkstraDokumentasjonsboks,
  ekstraInnsendingerUtenVedlegg,
  filtrerUtfylteInnsendinger,
} from '../utils/innsendingsvalidering';
import { v4 as uuidv4 } from 'uuid';
import {
  IEttersending,
  IDokumentasjonsbehov,
  ISøknadsbehov,
} from '../typer/ettersending';
import AlertStripe, { alertMelding } from './AlertStripe';
import { dagensDatoMedTidspunktStreng } from '../../shared-utils/dato';
import { Oppsummering } from './Oppsummering';
import { InnsendingSide } from './InnsendingSide';
import { slåSammenSøknadOgEttersendinger } from '../utils/søknadshåndtering';
import { logDokumentasjonsbehov, logSidevisning } from '../utils/amplitude';
import { EOppsummeringstitler } from '../utils/oppsummeringssteg';
import { Button, HStack, Loader, VStack } from '@navikt/ds-react';
import Stegindikator from './Stegindikator';

const Ettersendingsoversikt: React.FC = () => {
  const [laster, settLasterverdi] = useState(true);
  const [alertStripeMelding, settAlertStripeMelding] = useState<alertMelding>(
    alertMelding.TOM,
  );
  const [ettersending, settEttersending] = useState<IEttersending>({
    dokumentasjonsbehov: [],
    personIdent: '',
  });
  const [ekstraInnsendingerId, settEkstraInnsendingerId] = useState<string[]>(
    [],
  );
  const [
    ekstraInnsendingerSomManglerVedlegg,
    settEkstraInnsendingerSomManglerVedlegg,
  ] = useState<string[]>([]);
  const [aktivtSteg, settAktivtSteg] = useState<number>(0);

  const stegForInnsending = [
    {
      label: 'Last opp',
      index: 0,
    },
    {
      label: 'Send inn',
      index: 1,
    },
    {
      label: 'Kvittering',
      index: 2,
    },
  ];

  useEffect(() => {
    if (aktivtSteg === 0) {
      logSidevisning('Forside');
    } else if (aktivtSteg === 1) {
      logSidevisning('Oppsummering');
    } else if (aktivtSteg === 2) {
      logSidevisning('Kvittering');
    }
  }, [aktivtSteg]);

  const oppdaterInnsending = (innsending: IDokumentasjonsbehov) => {
    settEttersending((prevEttersending) => {
      return {
        ...prevEttersending,
        dokumentasjonsbehov: prevEttersending.dokumentasjonsbehov.map((i) => {
          return i.id === innsending.id ? innsending : i;
        }),
      };
    });
  };

  const slettInnsending = (id: string) => {
    settEttersending((prevEttersending) => {
      return {
        ...prevEttersending,
        dokumentasjonsbehov: prevEttersending.dokumentasjonsbehov.filter(
          (innsending) => innsending.id !== id,
        ),
      };
    });
    settEkstraInnsendingerId(
      ekstraInnsendingerId.filter((innsendingsId) => innsendingsId != id),
    );
    settEkstraInnsendingerSomManglerVedlegg(
      ekstraInnsendingerSomManglerVedlegg.filter(
        (innsendingsId) => innsendingsId != id,
      ),
    );
  };

  const leggTilNyInnsending = (innsending: IDokumentasjonsbehov) => {
    settEttersending({
      ...ettersending,
      dokumentasjonsbehov: [...ettersending.dokumentasjonsbehov, innsending],
    });
  };

  const leggTilNyEkstraInnsending = () => {
    const nyInnsending: IDokumentasjonsbehov = {
      id: uuidv4(),
      søknadsdata: undefined,
      dokumenttype: undefined,
      stønadType: undefined,
      beskrivelse: '',
      innsendingstidspunkt: dagensDatoMedTidspunktStreng(),
      vedlegg: [],
    };
    settEkstraInnsendingerId([...ekstraInnsendingerId, nyInnsending.id]);
    leggTilNyInnsending(nyInnsending);
  };

  const visOppsummering = () => {
    settAlertStripeMelding(alertMelding.TOM);
    settEkstraInnsendingerSomManglerVedlegg([]);
    if (
      minstEttVedleggErLastetOpp(ettersending.dokumentasjonsbehov) ||
      minstEnBoksErAvkrysset(ettersending.dokumentasjonsbehov)
    ) {
      if (
        minstEttVedleggErLastetOppForEkstraDokumentasjonsboks(
          ettersending.dokumentasjonsbehov,
          ekstraInnsendingerId,
        )
      ) {
        logDokumentasjonsbehov(ettersending.dokumentasjonsbehov);
        settAktivtSteg(1);
        return;
      }
      settEkstraInnsendingerSomManglerVedlegg(
        ekstraInnsendingerUtenVedlegg(
          ettersending.dokumentasjonsbehov,
          ekstraInnsendingerId,
        ),
      );
      return;
    }
    settAlertStripeMelding(alertMelding.MANGLER_VEDLEGG);
  };

  const gåTilForrigeSteg = () => {
    if (aktivtSteg > 0) {
      settAktivtSteg(aktivtSteg - 1);
    }
  };

  const sendInnEttersending = async () => {
    try {
      settAktivtSteg(2);
      const ettersendingTilBackend: IEttersending = {
        dokumentasjonsbehov: filtrerUtfylteInnsendinger(ettersending),
        personIdent: ettersending.personIdent,
      };
      await sendEttersending(ettersendingTilBackend);
      settAlertStripeMelding(alertMelding.SENDT_INN);
    } catch {
      settAlertStripeMelding(alertMelding.FEIL_VED_INNSENDING);
    }
  };

  const context = useApp();

  useEffect(() => {
    if (context.søker != null) hentOgSettSøknaderOgEttersendinger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.søker]);

  const hentOgSettSøknaderOgEttersendinger = async () => {
    console.log('Henter søknader og ettersendinger');
    const søknadsliste = await hentSøknader();
    console.log('søknadsliste', søknadsliste);
    const ettersendinger = await hentEttersendinger();
    console.log('ettersendinger', ettersendinger);

    const søknaderMedEttersendinger: ISøknadsbehov[] = søknadsliste.map(
      (søknad: ISøknadsbehov) => {
        return slåSammenSøknadOgEttersendinger(søknad, ettersendinger);
      },
    );

    const initielleInnsendinger: IDokumentasjonsbehov[] =
      søknaderMedEttersendinger.flatMap((søknad) => {
        return søknad.dokumentasjonsbehov.dokumentasjonsbehov
          .filter(
            (behov) =>
              behov.opplastedeVedlegg.length === 0 && !behov.harSendtInn,
          )
          .map((behov) => {
            return {
              id: uuidv4(),
              søknadsdata: {
                søknadId: søknad.søknadId,
                søknadsdato: søknad.søknadDato,
                dokumentasjonsbehovId: behov.id,
                harSendtInnTidligere: behov.harSendtInn,
              },
              dokumenttype: behov.id,
              beskrivelse: behov.label,
              stønadType: søknad.stønadType,
              innsendingstidspunkt: dagensDatoMedTidspunktStreng(),
              vedlegg: [],
            };
          });
      });

    settEttersending({
      dokumentasjonsbehov: initielleInnsendinger,
      personIdent: context.søker!.fnr,
    });
    settLasterverdi(false);
  };

  if (laster)
    return (
      <VStack align={'center'} justify={'space-between'}>
        <Loader size={'xlarge'} title={'Venter på at siden skal lastes inn'} />
      </VStack>
    );

  return (
    <>
      <Stegindikator
        stegListe={stegForInnsending}
        aktivtSteg={aktivtSteg}
        settAktivtSteg={settAktivtSteg}
      />

      {aktivtSteg === 0 && (
        <InnsendingSide
          ettersending={ettersending}
          oppdaterInnsending={oppdaterInnsending}
          slettInnsending={slettInnsending}
          leggTilNyDokumentasjonsbehovBoks={leggTilNyEkstraInnsending}
          ekstraInnsendingerId={ekstraInnsendingerId}
          visOppsummering={visOppsummering}
          ekstraInnsendingerUtenVedlegg={ekstraInnsendingerSomManglerVedlegg}
          settAlertStripeMelding={settAlertStripeMelding}
        />
      )}

      {aktivtSteg === 1 && (
        <>
          <Oppsummering
            tittel={EOppsummeringstitler.Innsending}
            innsendinger={filtrerUtfylteInnsendinger(ettersending)}
          />
          <VStack align={'center'}>
            <HStack align={'center'} gap={'space-4'}>
              <Button variant={'secondary'} onClick={gåTilForrigeSteg}>
                Tilbake
              </Button>

              <Button onClick={sendInnEttersending}>Send inn</Button>
            </HStack>
          </VStack>
        </>
      )}

      {aktivtSteg === 2 && (
        <Oppsummering
          tittel={EOppsummeringstitler.Kvittering}
          innsendinger={filtrerUtfylteInnsendinger(ettersending)}
        />
      )}

      <AlertStripe melding={alertStripeMelding} />
    </>
  );
};

export default Ettersendingsoversikt;
