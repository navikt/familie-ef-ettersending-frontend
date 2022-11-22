import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Undertekst } from 'nav-frontend-typografi';
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
} from '../utils/filer';
import heic2any from 'heic2any';
import { DokumentType, StønadType, stønadTypeTilTekst } from '../typer/stønad';
import axios from 'axios';
import KnappMedPadding from '../felles/Knapp';
import { Upload } from '@navikt/ds-icons';
import { BodyShort, Panel } from '@navikt/ds-react';

const Filopplaster = styled.div`
  text-align: center;
  font-weight: bold;
  border: 2px dashed var(--navds-semantic-color-border);
  border-radius: 4px;
  background-color: var(--navds-semantic-color-canvas-background);
  height: 4rem;
  line-height: 4rem;
  color: blue;
  cursor: pointer;
`;

const OpplastingIkon = styled(Upload)`
  display: inline-block;
  margin-right: 0.5rem;
`;

const OpplastingTekst = styled(BodyShort)`
  display: inline-block;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledAlertStripe = styled(AlertStripe)`
  margin-bottom: 1rem;
`;

const ModalWrapper = styled(Panel)`
  margin: 1.25rem;
  margin-top: 2rem;
  max-width: 38rem;
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

interface IProps {
  oppdaterInnsending: (innsending: IDokumentasjonsbehov) => void;
  innsending: IDokumentasjonsbehov;
  maxFilstørrelse?: number;
  lukkModal: () => void;
  stønadType?: StønadType;
  beskrivelse: string;
}

const VedleggsopplasterModal: React.FC<IProps> = ({
  innsending,
  oppdaterInnsending,
  maxFilstørrelse,
  lukkModal,
  stønadType,
  beskrivelse,
}: IProps) => {
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

  const dokumenterSkalSammenslås = (
    dokumentType: string | undefined,
    antallVedlegg: number
  ) => {
    return !(dokumentType === DokumentType.ANNET || antallVedlegg === 1);
  };

  const slåSammenVedleggOgOppdaterInnsending = async () => {
    settAlertStripeMelding(alertMelding.TOM);
    if (
      dokumenterSkalSammenslås(
        innsending.dokumenttype,
        vedleggForSammenslåing.length
      )
    ) {
      try {
        const dokumentId = await slåSammenVedlegg(
          vedleggForSammenslåing.map((v) => v.id)
        );
        const nyInnsending = leggTilVedleggPåInnsending([
          {
            navn: innsending.dokumenttype
              ? innsending.dokumenttype.toLowerCase() + '.pdf'
              : vedleggForSammenslåing[0].navn,
            tittel: vedleggForSammenslåing[0].tittel,
            id: dokumentId,
          },
        ]);
        oppdaterInnsending({ ...nyInnsending, erSammenslått: true });
        lukkModal();
      } catch (error: unknown) {
        settAlertStripeMelding(alertMelding.FEIL_SAMMENSLÅING_DOKUMENT);
      }
    } else {
      const nyInnsending = leggTilVedleggPåInnsending(vedleggForSammenslåing);
      oppdaterInnsending({ ...nyInnsending, erSammenslått: false });
      lukkModal();
    }
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
        } catch (error: unknown) {
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
    settAlertStripeMelding(alertMelding.TOM);

    const filer: File[] = await Promise.all(
      filerForOpplasting.map(async (fil: File): Promise<File> => {
        if (maxFilstørrelse && fil.size > maxFilstørrelse) {
          const maks = formaterFilstørrelse(maxFilstørrelse);

          const feilmelding = `${fil.name} er for stor (maksimal filstørrelse er ${maks})`;

          feilmeldingsliste.push(feilmelding);
          settAlertStripeMelding(alertMelding.FEIL_STØRRELSE_INNSENDING);

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

            return await new File([nyBlob as Blob], fil.name + '.jpg');
          }

          const feilmelding = fil.name + ' - Ugyldig filtype';
          feilmeldingsliste.push(feilmelding);
          settAlertStripeMelding(alertMelding.FEIL_FILTYPE_INNSENDING);

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
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <ModalWrapper>
      <strong>{beskrivelse}</strong>
      <p>
        <strong>Stønadstype: </strong>
        {stønadTypeTilTekst[stønadType as StønadType]}
      </p>
      <Filopplaster>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <OpplastingIkon title={'Last opp'} />
          <OpplastingTekst>Velg filer</OpplastingTekst>
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
      <KnappContainer>
        <KnappMedPadding
          onClick={slåSammenVedleggOgOppdaterInnsending}
          disabled={vedleggForSammenslåing.length < 1 || laster}
        >
          Last opp
        </KnappMedPadding>
      </KnappContainer>
    </ModalWrapper>
  );
};

export default VedleggsopplasterModal;
