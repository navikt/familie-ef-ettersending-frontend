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
import styled from 'styled-components';
import AlertStripe, { alertMelding } from './AlertStripe';
import { dagensDatoMedTidspunktStreng } from '../../shared-utils/dato';
import { Oppsummering } from './Oppsummering';
import { InnsendingSide } from './InnsendingSide';
import { slåSammenSøknadOgEttersendinger } from '../utils/søknadshåndtering';
import { logDokumentasjonsbehov, logSidevisning } from '../utils/amplitude';
import { EOppsummeringstitler } from '../utils/oppsummeringssteg';
import KnappMedPadding from '../felles/Knapp';
import { Loader } from '@navikt/ds-react';
import Stegindikator from './Stegindikator';

const SekundærKnapp = styled(KnappMedPadding)`
  margin: 1rem;
`;

const StyledAlertStripe = styled(AlertStripe)`
  margin-top: 1rem;
`;

const DivMidtstillInnhold = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

const Ettersendingsoversikt: React.FC = () => {
  const [laster, settLasterverdi] = useState(true);
  const [alertStripeMelding, settAlertStripeMelding] = useState<alertMelding>(
    alertMelding.TOM
  );
  const [ettersending, settEttersending] = useState<IEttersending>({
    dokumentasjonsbehov: [],
    personIdent: '',
  });
  const [ekstraInnsendingerId, settEkstraInnsendingerId] = useState<string[]>(
    []
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
          (innsending) => innsending.id !== id
        ),
      };
    });
    settEkstraInnsendingerId(
      ekstraInnsendingerId.filter((innsendingsId) => innsendingsId != id)
    );
    settEkstraInnsendingerSomManglerVedlegg(
      ekstraInnsendingerSomManglerVedlegg.filter(
        (innsendingsId) => innsendingsId != id
      )
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
          ekstraInnsendingerId
        )
      ) {
        logDokumentasjonsbehov(ettersending.dokumentasjonsbehov);
        settAktivtSteg(1);
        return;
      }
      settEkstraInnsendingerSomManglerVedlegg(
        ekstraInnsendingerUtenVedlegg(
          ettersending.dokumentasjonsbehov,
          ekstraInnsendingerId
        )
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
  }, [context.søker]);

  const hentOgSettSøknaderOgEttersendinger = async () => {
    const søknadsliste = await hentSøknader();
    const ettersendinger = await hentEttersendinger();

    const søknaderMedEttersendinger: ISøknadsbehov[] = søknadsliste.map(
      (søknad: ISøknadsbehov) => {
        return slåSammenSøknadOgEttersendinger(søknad, ettersendinger);
      }
    );

    const initielleInnsendinger: IDokumentasjonsbehov[] =
      søknaderMedEttersendinger.flatMap((søknad) => {
        return søknad.dokumentasjonsbehov.dokumentasjonsbehov
          .filter(
            (behov) =>
              behov.opplastedeVedlegg.length === 0 && !behov.harSendtInn
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
      <DivMidtstillInnhold>
        <Loader size={'xlarge'} title={'Venter på at siden skal lastes inn'} />
      </DivMidtstillInnhold>
    );

  return (
    <>
      <Stegindikator stegListe={stegForInnsending} aktivtSteg={aktivtSteg} />
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
          <DivMidtstillInnhold>
            <SekundærKnapp variant={'secondary'} onClick={gåTilForrigeSteg}>
              Tilbake
            </SekundærKnapp>
            <SekundærKnapp onClick={sendInnEttersending}>
              Send inn
            </SekundærKnapp>
          </DivMidtstillInnhold>
        </>
      )}
      {aktivtSteg === 2 && (
        <Oppsummering
          tittel={EOppsummeringstitler.Kvittering}
          innsendinger={filtrerUtfylteInnsendinger(ettersending)}
        />
      )}
      <StyledAlertStripe melding={alertStripeMelding} />
    </>
  );
};

export default Ettersendingsoversikt;
