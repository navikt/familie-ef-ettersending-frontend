import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { hentDokumentasjonsbehov, hentEttersendinger } from '../api-service';
import { v4 as uuidv4 } from 'uuid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import {
  IEttersendingMedDato,
  IEttersendingX,
  IInnsending,
  IInnsendingX,
  ISøknadMedEttersendinger,
  ISøknadsbehov,
} from '../typer/ettersending';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import AlertStripe, { alertMelding } from './AlertStripe';
import { IDokumentasjonsbehov } from '../typer/dokumentasjonsbehov';
import { dagensDatoMedTidspunktStreng } from '../../shared-utils/dato';
import { DokumentasjonsbehovListe } from './DokumentasjonsbehovListe';
import { LeggTilInnsending } from './LeggTilInnsending';
import { EkstraDokumentasjonsbehovBoks } from './EkstraDokumentasjonsbehovBoks';
import { Oppsummering } from './Oppsummering';
import Stegindikator from 'nav-frontend-stegindikator';

const SoknadContainer = styled.div`
  padding-bottom: 0rem;
`;

const StyledKnapp = styled(Knapp)`
  margin: 1rem auto;
  display: flex;
`;

const StyledHovedknapp = styled(Hovedknapp)`
  margin: 1rem auto;
  display: flex;
`;

const StyledAlertStripe = styled(AlertStripe)`
  margin-top: 1rem;
`;

const StyledDiv = styled.div`
  display: flex;
`;

const StyledStegindikator = styled(Stegindikator)`
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const Ettersendingsoversikt: React.FC = () => {
  const [laster, settLasterverdi] = useState(true);
  const [alertStripeMelding, settAlertStripeMelding] = useState<alertMelding>(
    alertMelding.TOM
  );
  const [ettersendingX, settEttersendingX] = useState<IEttersendingX>({
    innsendinger: [],
    fnr: '',
  });
  const [ekstraInnsendingerId, settEkstraInnsendingerId] = useState<string[]>(
    []
  );
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

  const oppdaterInnsendingX = (innsending: IInnsendingX) => {
    settEttersendingX((prevEttersending) => {
      return {
        ...prevEttersending,
        innsendinger: prevEttersending.innsendinger.map((i) => {
          return i.id === innsending.id ? innsending : i;
        }),
      };
    });
  };

  const slettInnsending = (id: string) => {
    settEttersendingX((prevEttersending) => {
      return {
        ...prevEttersending,
        innsendinger: prevEttersending.innsendinger.filter(
          (innsending) => innsending.id !== id
        ),
      };
    });
  };

  const leggTilNyInnsendingX = (innsending: IInnsendingX) => {
    settEttersendingX({
      ...ettersendingX,
      innsendinger: [...ettersendingX.innsendinger, innsending],
    });
  };

  const leggTilNyEkstraInnsendingX = () => {
    const nyInnsending: IInnsendingX = {
      id: uuidv4(),
      søknadsdata: {
        søknadId: '',
        søknadDato: '',
        dokumentasjonsbehovId: '',
        harSendtInnTidligere: false,
      },
      dokumenttype: undefined,
      stønadType: undefined,
      beskrivelse: '',
      innsendingDato: dagensDatoMedTidspunktStreng(),
      vedlegg: [],
    };
    settEkstraInnsendingerId([...ekstraInnsendingerId, nyInnsending.id]);
    leggTilNyInnsendingX(nyInnsending);
  };

  const alleVedleggErLastetOpp = (): boolean => {
    return ettersendingX.innsendinger
      .filter(
        (innsending) => innsending.søknadsdata.harSendtInnTidligere === false
      )
      .every((innsending) => innsending.vedlegg.length > 0);
  };

  const visOppsummering = () => {
    if (alleVedleggErLastetOpp()) {
      settAlertStripeMelding(alertMelding.TOM);
      settAktivtSteg(1);
      return;
    }
    settAlertStripeMelding(alertMelding.MANGLER_VEDLEGG);
  };

  const gåTilForrigeSteg = () => {
    if (aktivtSteg > 0) {
      settAktivtSteg(aktivtSteg - 1);
    }
  };

  const sendEttersending = () => {
    try {
      //TODO: Send inn data til backend
      settAktivtSteg(2);
      settAlertStripeMelding(alertMelding.SENDT_INN);
    } catch {
      settAlertStripeMelding(alertMelding.FEIL);
    }
  };

  const context = useApp();

  useEffect(() => {
    if (context.søker != null) hentOgSettSøknaderOgEttersendinger();
  }, [context.søker]);

  const leggTilDataPåInnsendingVedlegg = (
    innsendinger: IInnsending[],
    dato: string
  ): IInnsending[] => {
    return innsendinger.flatMap((innsending) => {
      // TODO: Dupliseres og er vanskelig å lese - trekk ut som egen funksjon
      const vedleggListe = innsending.vedlegg.map((vedlegg) => {
        return {
          ...vedlegg,
          dato: dato,
          beskrivelse: innsending.beskrivelse,
          dokumenttype: innsending.dokumenttype,
        };
      });
      return { ...innsending, vedlegg: vedleggListe };
    });
  };

  const leggTilDatoPåEttersendingVedlegg = (
    ettersendinger: IEttersendingMedDato[]
  ): IEttersendingMedDato[] => {
    return ettersendinger.map((ettersending) => {
      const ettersendingDato = ettersending.mottattTidspunkt;
      if (ettersending.ettersendingDto.ettersendingForSøknad) {
        const dokumentasjonsbehov: IDokumentasjonsbehov[] =
          ettersending.ettersendingDto.ettersendingForSøknad.dokumentasjonsbehov.flatMap(
            (behov) => {
              return {
                ...behov,
                opplastedeVedlegg: behov.opplastedeVedlegg.map((vedlegg) => {
                  return { ...vedlegg, dato: ettersendingDato };
                }),
              };
            }
          );
        const innsending: IInnsending[] = leggTilDataPåInnsendingVedlegg(
          ettersending.ettersendingDto.ettersendingForSøknad.innsending,
          ettersendingDato
        );
        return {
          ...ettersending,
          ettersendingDto: {
            ...ettersending.ettersendingDto,
            ettersendingForSøknad: {
              ...ettersending.ettersendingDto.ettersendingForSøknad,
              dokumentasjonsbehov: dokumentasjonsbehov,
              innsending: innsending,
            },
          },
        };
      } else if (ettersending.ettersendingDto.ettersendingUtenSøknad) {
        const innsending: IInnsending[] = leggTilDataPåInnsendingVedlegg(
          ettersending.ettersendingDto.ettersendingUtenSøknad.innsending,
          ettersendingDato
        );
        return {
          ...ettersending,
          ettersendingDto: {
            ...ettersending.ettersendingDto,
            ettersendingUtenSøknad: {
              ...ettersending.ettersendingDto.ettersendingUtenSøknad,
              innsending: innsending,
            },
          },
        };
      }
      return ettersending;
    });
  };

  const slåSammenSøknadOgEttersendinger = (
    søknad: ISøknadsbehov,
    ettersendinger: IEttersendingMedDato[],
    søknadDato: string
  ): ISøknadMedEttersendinger => {
    const ettersendingForSøknad = ettersendinger.filter(
      (ettersendingMedDato) =>
        ettersendingMedDato.ettersendingDto.ettersendingForSøknad &&
        ettersendingMedDato.ettersendingDto.ettersendingForSøknad.søknadId ===
          søknad.søknadId
    );
    const ettersendingDokumentasjonsbehov = ettersendingForSøknad.flatMap(
      (ettersendingMedDato) =>
        ettersendingMedDato.ettersendingDto.ettersendingForSøknad!
          .dokumentasjonsbehov
    );
    const ettersendingInnsending = ettersendingForSøknad.flatMap(
      (ettersendingMedDato) =>
        ettersendingMedDato.ettersendingDto.ettersendingForSøknad!.innsending
    );
    const dokumentasjonsbehov =
      søknad.dokumentasjonsbehov.dokumentasjonsbehov.map((behov) => {
        const ettersendingBehov = ettersendingDokumentasjonsbehov.filter(
          (ettersendingBehov) => ettersendingBehov.id === behov.id
        );
        const ettersendingBehovVedlegg = ettersendingBehov.flatMap(
          (behov) => behov.opplastedeVedlegg
        );
        const ettersenidngHarSendtInnTidligere = ettersendingBehov.some(
          (behov) => behov.harSendtInn
        );
        const søknadVedleggMedDato = behov.opplastedeVedlegg.map((vedlegg) => {
          return { ...vedlegg, dato: søknadDato };
        });

        if (ettersendingBehov.length > 0) {
          return {
            ...behov,
            harSendtInn: behov.harSendtInn || ettersenidngHarSendtInnTidligere,
            opplastedeVedlegg: [
              ...søknadVedleggMedDato,
              ...ettersendingBehovVedlegg,
            ],
            innsending: [],
          };
        }
        return { ...behov, opplastedeVedlegg: søknadVedleggMedDato };
      });

    return {
      ...søknad,
      dokumentasjonsbehov: dokumentasjonsbehov,
      innsending: ettersendingInnsending,
    };
  };

  const hentOgSettSøknaderOgEttersendinger = async () => {
    const søknadsliste = await hentDokumentasjonsbehov();
    const ettersendinger = await hentEttersendinger();

    const søknaderMedEttersendinger: ISøknadMedEttersendinger[] =
      søknadsliste.map((søknad) => {
        const søknadDato = søknad.søknadDato;
        const ettersendingerMedVedleggDato =
          leggTilDatoPåEttersendingVedlegg(ettersendinger);
        return slåSammenSøknadOgEttersendinger(
          søknad,
          ettersendingerMedVedleggDato,
          søknadDato
        );
      });

    const initielleInnsendinger: IInnsendingX[] =
      søknaderMedEttersendinger.flatMap((søknad) => {
        return søknad.dokumentasjonsbehov
          .filter((behov) => behov.opplastedeVedlegg.length === 0)
          .map((behov) => {
            return {
              id: uuidv4(),
              søknadsdata: {
                søknadId: søknad.søknadId,
                søknadDato: søknad.søknadDato,
                dokumentasjonsbehovId: behov.id,
                harSendtInnTidligere: behov.harSendtInn,
              },
              beskrivelse: behov.label,
              stønadType: søknad.stønadType,
              innsendingDato: dagensDatoMedTidspunktStreng(),
              vedlegg: [],
            };
          });
      });

    settEttersendingX({
      innsendinger: initielleInnsendinger,
      fnr: context.søker!.fnr,
    });
    settLasterverdi(false);
  };

  if (laster) return <NavFrontendSpinner />;

  return (
    <>
      <StyledStegindikator
        steg={stegForInnsending}
        aktivtSteg={aktivtSteg}
        visLabel={true}
        autoResponsiv={true}
      />
      {aktivtSteg === 0 &&
        ettersendingX.innsendinger
          .filter(
            (innsendingx) => !ekstraInnsendingerId.includes(innsendingx.id)
          )
          .map((innsendingx) => {
            return (
              <SoknadContainer key={innsendingx.id}>
                <DokumentasjonsbehovListe
                  innsendingx={innsendingx}
                  oppdaterInnsendingx={oppdaterInnsendingX}
                />
              </SoknadContainer>
            );
          })}
      {aktivtSteg === 0 &&
        ettersendingX.innsendinger
          .filter((innsendingx) =>
            ekstraInnsendingerId.includes(innsendingx.id)
          )
          .map((innsendingx) => {
            return (
              <EkstraDokumentasjonsbehovBoks
                key={innsendingx.id}
                innsendingx={innsendingx}
                oppdaterInnsendingx={oppdaterInnsendingX}
                slettEkstraInnsending={slettInnsending}
              />
            );
          })}
      {aktivtSteg === 0 && (
        <>
          <div>
            <LeggTilInnsending
              leggTilNyDokumentasjonsbehovBoks={leggTilNyEkstraInnsendingX}
            >
              Legg til flere dokumenter
            </LeggTilInnsending>
          </div>
          <StyledDiv>
            <StyledHovedknapp onClick={visOppsummering}>Neste</StyledHovedknapp>
          </StyledDiv>
        </>
      )}
      {aktivtSteg === 1 && (
        <>
          <Oppsummering
            tittel={'Følgende dokumentasjon er klar til innsending'}
            innsendinger={ettersendingX.innsendinger}
          />
          <StyledDiv>
            <StyledKnapp onClick={gåTilForrigeSteg}>Tilbake</StyledKnapp>
            <StyledHovedknapp onClick={sendEttersending}>
              Send inn
            </StyledHovedknapp>
          </StyledDiv>
        </>
      )}
      {aktivtSteg === 2 && (
        <>
          <Oppsummering
            tittel={'Følgende dokumentasjon er sendt inn'}
            innsendinger={ettersendingX.innsendinger}
          />
        </>
      )}
      <StyledAlertStripe melding={alertStripeMelding} />
    </>
  );
};

export default Ettersendingsoversikt;
