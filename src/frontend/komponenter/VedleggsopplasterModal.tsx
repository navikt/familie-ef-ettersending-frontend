import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import opplasting from '../icons/opplasting.svg';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import {
  IDokumentasjonsbehov,
  IVedleggForEttersending,
} from '../typer/ettersending';
import { sendVedleggTilMellomlager, slåSammenVedlegg } from '../api-service';
import styled from 'styled-components/macro';
import AlertStripe, { alertMelding } from './AlertStripe';
import { logFeilFilopplasting } from '../utils/amplitude';
import {
  erFiltypeHeic,
  formaterFilstørrelse,
  sjekkTillatFiltype,
  støtterFiltypeHeic,
  tillateFiltyper,
} from '../utils/filer';
import heic2any from 'heic2any';
import { Knapp } from 'nav-frontend-knapper';
import {
  DokumentType,
  dokumentTypeTilTekst,
  StønadType,
  stønadTypeTilTekst,
} from '../typer/stønad';
import Panel from 'nav-frontend-paneler';
import axios from 'axios';

const Filopplaster = styled.div<{ visSkillelinje: boolean }>`
    text-align: center;
    font-weight: bold;
    border: 2px dashed #59514b;
    border-radius: 4px;
    background-color: rgba(204, 222, 230, 0.5);
    border-bottom: ${(props) =>
      props.visSkillelinje ? '2px dashed #59514b' : ''};
    height: 64px;
    color: blue;
    margin: 0 auto;
    cursor: pointer;
    .opplastingsikon {
      display: inline-block;
    };
    .tekst {
      line-height: 64px;
      display: inline-block;
      margin-left: 10px;
    }
  }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledAlertStripe = styled(AlertStripe)`
  margin-bottom: 1rem;
`;

const StyledNormaltekst = styled(Normaltekst)`
  margin-top: 1rem;
`;

const ModalWrapper = styled(Panel)`
  margin: 1.25rem;
  margin-top: 2rem;
  max-width: 600px;
`;

const UndertekstWrapper = styled(Undertekst)`
  padding-top: 1rem;
  padding-bottom: 1rem;
  text-align: center;
`;

const KnappContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 1rem;
`;

const FeilmeldingContainer = styled.div`
  margin: 1rem 0 0 0;
  text-align: left;
`;

const AlertStripeContainer = styled(AlertStripeFeil)`
  background: none !important;
  border: none !important;
  padding: 0;
  font-weight: bold;

  div {
    font-weight: bold;
  }
`;

interface IProps {
  oppdaterInnsending: (innsending: IDokumentasjonsbehov) => void;
  innsending: IDokumentasjonsbehov;
  maxFilstørrelse?: number;
  lukkModal: () => void;
  stønadType?: StønadType;
  dokumentType?: string;
}

const VedleggsopplasterModal: React.FC<IProps> = ({
  innsending,
  oppdaterInnsending,
  maxFilstørrelse,
  lukkModal,
  stønadType,
  dokumentType,
}: IProps) => {
  const [feilmeldinger, settFeilmeldinger] = useState<string[]>([]);
  const [alertStripeMelding, settAlertStripeMelding] = useState<alertMelding>(
    alertMelding.TOM
  );
  const [laster, settLaster] = useState<boolean>(false);
  const [vedleggForSammenslåing, settVedleggForSammenslåing] = useState<
    IVedleggForEttersending[]
  >([]);

  const leggTilVedleggPåInnsending = (
    nyeVedlegg: IVedleggForEttersending[]
  ): IDokumentasjonsbehov => {
    return {
      ...innsending,
      vedlegg: [...innsending.vedlegg, ...nyeVedlegg],
    };
  };

  const slåSammenVedleggOgOppdaterInnsending = async () => {
    if (
      innsending.dokumenttype === DokumentType.ANNET ||
      vedleggForSammenslåing.length === 1
    ) {
      const nyInnsending = leggTilVedleggPåInnsending(vedleggForSammenslåing);
      oppdaterInnsending(nyInnsending);
    } else {
      const dokumentId = await slåSammenVedlegg(
        vedleggForSammenslåing.map((v) => v.id)
      );
      const nyInnsending = leggTilVedleggPåInnsending([
        {
          navn: vedleggForSammenslåing[0].navn,
          tittel: vedleggForSammenslåing[0].tittel,
          id: dokumentId,
        },
      ]);
      oppdaterInnsending(nyInnsending);
    }
    lukkModal();
  };

  const slettVedlegg = (vedlegg: IVedleggForEttersending): void => {
    settVedleggForSammenslåing((prevState) => {
      return prevState.filter(
        (v: IVedleggForEttersending) => v.id !== vedlegg.id
      );
    });
  };

  const lastOppVedlegg = async (filer: File[]) => {
    settLaster(true);
    settAlertStripeMelding(alertMelding.TOM);

    const vedleggListe: IVedleggForEttersending[] = [];

    await Promise.all(
      filer.map(async (fil) => {
        try {
          const formData = new FormData();
          formData.append('file', fil);
          const respons = await sendVedleggTilMellomlager(formData);
          const vedlegg: IVedleggForEttersending = {
            id: respons,
            navn: fil.name,
            tittel: innsending.beskrivelse || 'Ukjent tittel',
          };
          vedleggListe.push(vedlegg);
        } catch (error: any) {
          const feilmelding =
            axios.isAxiosError(error) &&
            error?.response?.data?.melding === 'CODE=IMAGE_DIMENSIONS_TOO_SMALL'
              ? alertMelding.FEIL_FOR_LITEN_FIL
              : alertMelding.FEIL;
          settAlertStripeMelding(feilmelding);

          logFeilFilopplasting({
            type_feil: 'Generisk feil',
            feilmelding: feilmelding,
            filtype: fil.type,
            filstørrelse: fil.size,
          });
        }
      })
    );
    settVedleggForSammenslåing((prevState) => [...prevState, ...vedleggListe]);
    settLaster(false);
  };

  const onDrop = async (filerForOpplasting: File[]) => {
    const feilmeldingsliste: string[] = [];

    const filer: File[] = await Promise.all(
      filerForOpplasting.map(async (fil: File): Promise<File> => {
        if (maxFilstørrelse && fil.size > maxFilstørrelse) {
          const maks = formaterFilstørrelse(maxFilstørrelse);

          const feilmelding = `${fil.name} er for stor (maksimal filstørrelse er ${maks})`;

          feilmeldingsliste.push(feilmelding);
          settFeilmeldinger(feilmeldingsliste);

          logFeilFilopplasting({
            type_feil: 'For stor fil',
            feilmelding: feilmelding,
            filstørrelse: fil.size,
          });

          return fil;
        }

        if (!sjekkTillatFiltype(fil.type)) {
          if (erFiltypeHeic(fil) && støtterFiltypeHeic()) {
            const nyBlob = await heic2any({
              blob: fil,
              toType: 'image/jpg',
              quality: 1,
            });

            const nyFil = await new File([nyBlob as Blob], fil.name + '.jpg');

            return nyFil;
          }

          const feilmelding = fil.name + ' - Ugyldig filtype';
          feilmeldingsliste.push(feilmelding);
          settFeilmeldinger(feilmeldingsliste);

          logFeilFilopplasting({
            type_feil: 'Feil filtype',
            feilmelding: feilmelding,
            filtype: fil.type,
          });

          return fil;
        }

        return fil;
      })
    );
    if (feilmeldingsliste.length <= 0) {
      lastOppVedlegg(filer);
      settFeilmeldinger([]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <ModalWrapper>
      <b>{dokumentTypeTilTekst[dokumentType as DokumentType]}</b>
      <p>
        <b>Stønadstype: </b>
        {stønadTypeTilTekst[stønadType as StønadType]}
      </p>
      <Filopplaster visSkillelinje={false}>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <img
            src={opplasting}
            className="opplastingsikon"
            alt="Opplastingsikon"
          />
          <Normaltekst className="tekst">Last opp fil(er)</Normaltekst>
        </div>
      </Filopplaster>
      <OpplastedeVedlegg
        vedleggsliste={vedleggForSammenslåing}
        slettVedlegg={slettVedlegg}
      />
      {laster && (
        <SpinnerWrapper>
          <NavFrontendSpinner />
        </SpinnerWrapper>
      )}
      <UndertekstWrapper>
        Hvis dokumentet du skal sende inn består av flere filer, kan du legge
        til alle filene her. <br /> Filene blir slått sammen til ett dokument.
      </UndertekstWrapper>
      <StyledAlertStripe melding={alertStripeMelding} />
      {feilmeldinger.length > 0 && (
        <FeilmeldingContainer>
          {feilmeldinger.map((feilmelding) => (
            <AlertStripeContainer key={feilmelding}>
              {feilmelding}
            </AlertStripeContainer>
          ))}
          <StyledNormaltekst>
            <b>Tillate filtyper:</b> {tillateFiltyper.join('\t')}
          </StyledNormaltekst>
        </FeilmeldingContainer>
      )}
      <KnappContainer>
        <Knapp
          onClick={slåSammenVedleggOgOppdaterInnsending}
          disabled={vedleggForSammenslåing.length < 1 || laster}
        >
          Last opp
        </Knapp>
      </KnappContainer>
    </ModalWrapper>
  );
};

export default VedleggsopplasterModal;
