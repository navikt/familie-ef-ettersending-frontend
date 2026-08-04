import React, { useState } from 'react';
import { OpplastedeVedlegg } from './OpplastedeVedlegg';
import {
  IDokumentasjonsbehov,
  IVedleggForEttersending,
} from '../typer/ettersending';
import {
  sendVedleggTilMellomlager,
  slåSammenVedlegg,
  ApiError,
} from '../api-service';
import AlertStripe, { alertMelding } from './AlertStripe';
import {
  formaterFilstørrelse,
  sjekkTillatFiltype,
  tillateFiltyperAccept,
} from '../utils/filer';
import { DokumentType, StønadType, stønadTypeTilTekst } from '../typer/stønad';
import {
  Box,
  Button,
  FileUpload,
  Heading,
  HStack,
  Loader,
  VStack,
  BodyShort,
} from '@navikt/ds-react';

interface IProps {
  oppdaterInnsending: (innsending: IDokumentasjonsbehov) => void;
  innsending: IDokumentasjonsbehov;
  maxFilstørrelse?: number;
  lukkModal: () => void;
  stønadType?: StønadType;
  beskrivelse: string;
}

const Vedleggsvelger: React.FC<IProps> = ({
  innsending,
  oppdaterInnsending,
  maxFilstørrelse,
  lukkModal,
  stønadType,
  beskrivelse,
}: IProps) => {
  const [alertStripeMelding, settAlertStripeMelding] = useState<alertMelding>(
    alertMelding.TOM,
  );
  const [laster, settLaster] = useState<boolean>(false);
  const [vedleggForSammenslåing, settVedleggForSammenslåing] = useState<
    IVedleggForEttersending[]
  >([]);

  const leggTilVedleggPåInnsending = (
    nyeVedlegg: IVedleggForEttersending[],
  ): IDokumentasjonsbehov => {
    return {
      ...innsending,
      vedlegg: [...innsending.vedlegg, ...nyeVedlegg],
    };
  };

  const skalDokumenttypeSlåsSammen = (dokumentType: string | undefined) =>
    dokumentType !== DokumentType.ANNET;

  const dokumenterSkalSammenslås = (
    dokumentType: string | undefined,
    antallVedlegg: number,
  ) => {
    return skalDokumenttypeSlåsSammen(dokumentType) && antallVedlegg > 1;
  };

  const slåSammenVedleggOgOppdaterInnsending = async () => {
    settAlertStripeMelding(alertMelding.TOM);
    if (
      dokumenterSkalSammenslås(
        innsending.dokumenttype,
        vedleggForSammenslåing.length,
      )
    ) {
      try {
        const dokumentId = await slåSammenVedlegg(
          vedleggForSammenslåing.map((v) => v.id),
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
      } catch {
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
        (v: IVedleggForEttersending) => v.id !== vedlegg.id,
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
            størrelse: fil.size,
          };
          vedleggListe.push(vedlegg);
        } catch (error: unknown) {
          const data = (error as ApiError).data as
            Record<string, unknown> | undefined;
          const erForLitenFil =
            data?.melding === 'CODE=IMAGE_DIMENSIONS_TOO_SMALL';
          settAlertStripeMelding(
            erForLitenFil ? alertMelding.FEIL_FOR_LITEN_FIL : alertMelding.FEIL,
          );
        }
      }),
    );
    settVedleggForSammenslåing((prevState) => [...prevState, ...vedleggListe]);
    settLaster(false);
  };

  const håndterValgteFiler = (
    _filer: unknown,
    sorterteFiler: { accepted: File[]; rejected: unknown[] },
  ): void => {
    lastOppVedlegg(sorterteFiler.accepted);
  };

  const validerFil = (fil: File): true | string => {
    if (maxFilstørrelse && fil.size > maxFilstørrelse) {
      const maks = formaterFilstørrelse(maxFilstørrelse);
      return `${fil.name} er for stor (maksimal filstørrelse er ${maks})`;
    }

    if (!sjekkTillatFiltype(fil)) {
      return `${fil.name} - Ugyldig filtype`;
    }

    return true;
  };

  return (
    <Box margin={'space-4'}>
      <VStack gap={'space-16'}>
        <Heading level={'1'} size={'xsmall'}>
          {beskrivelse}
        </Heading>

        <HStack>
          <BodyShort>
            <b>Stønadstype:</b> {stønadTypeTilTekst[stønadType as StønadType]}
          </BodyShort>
        </HStack>

        <FileUpload.Dropzone
          label="Velg filer"
          description="Du kan laste opp PDF-, PNG- og JPG-filer"
          accept={tillateFiltyperAccept}
          maxSizeInBytes={maxFilstørrelse}
          validator={validerFil}
          onSelect={håndterValgteFiler}
          multiple
        />

        <OpplastedeVedlegg
          vedleggsliste={vedleggForSammenslåing}
          slettVedlegg={slettVedlegg}
        />

        {laster && (
          <VStack align={'center'}>
            <Loader
              size={'large'}
              title={'venter på at valgte filer skal lastes opp'}
            />
          </VStack>
        )}

        <BodyShort size={'small'}>
          Hvis dokumentet du skal sende inn består av flere filer, kan du legge
          til alle filene her.
          {skalDokumenttypeSlåsSammen(innsending.dokumenttype) && (
            <> Filene blir slått sammen til ett dokument.</>
          )}
        </BodyShort>

        <AlertStripe melding={alertStripeMelding} />

        <VStack align={'center'}>
          <Button
            onClick={slåSammenVedleggOgOppdaterInnsending}
            disabled={vedleggForSammenslåing.length < 1 || laster}
          >
            Last opp
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default Vedleggsvelger;
