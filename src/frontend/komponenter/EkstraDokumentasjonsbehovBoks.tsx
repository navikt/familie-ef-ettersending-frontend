import React, { ChangeEvent, useEffect, useState } from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import {
  DokumentType,
  dokumenttyperForStønad,
  dokumentTypeTilTekst,
  stønadsTyper,
  StønadType,
  stønadTypeTilTekst,
} from '../typer/stønad';
import { IDokumentasjonsbehov } from '../typer/ettersending';
import AlertStripe, { alertMelding } from './AlertStripe';
import { filstørrelse_10MB } from '../utils/filer';
import {
  Alert,
  BodyLong,
  Box,
  Button,
  Heading,
  HStack,
  Select,
  VStack,
} from '@navikt/ds-react';

interface IProps {
  innsending: IDokumentasjonsbehov;
  oppdaterInnsending: (innsending: IDokumentasjonsbehov) => void;
  slettEkstraInnsending: (id: string) => void;
  innsendingerUtenVedlegg: string[];
  settOverordnetAlertStripeMelding: (melding: alertMelding) => void;
}

export const EkstraDokumentasjonsbehovBoks: React.FC<IProps> = ({
  innsending,
  oppdaterInnsending,
  slettEkstraInnsending,
  innsendingerUtenVedlegg,
  settOverordnetAlertStripeMelding,
}: IProps) => {
  const [valgtDokumentType, settValgtDokumentType] = useState<string>();
  const [valgtStønadType, settValgtStønadType] = useState<StønadType>();
  const [harLåstValg, settHarLåstValg] = useState<boolean>(false);
  const [alertStripeMelding, settAlertStripeMelding] = useState<alertMelding>(
    alertMelding.TOM,
  );

  useEffect(() => {
    if (innsending.vedlegg.length > 0) settHarLåstValg(true);
    settValgtDokumentType(innsending.dokumenttype);
    settValgtStønadType(innsending.stønadType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dokumentTypeOgStønadTypeErValgt = (): boolean => {
    return !!(
      valgtDokumentType &&
      valgtStønadType &&
      valgtDokumentType !== ('Velg dokumenttype' as DokumentType) &&
      valgtStønadType !== ('Velg stønadstype' as StønadType)
    );
  };

  const erDokumentasjonSendt =
    innsending.søknadsdata?.harSendtInnTidligere ||
    innsending.vedlegg.length > 0;

  const låsValg = (bool: boolean) => {
    settHarLåstValg(bool);
  };

  const håndterKnappeKlikk = () => {
    if (dokumentTypeOgStønadTypeErValgt()) {
      settAlertStripeMelding(alertMelding.TOM);
      låsValg(true);
      const oppdatertInnsending = {
        ...innsending,
        stønadType: valgtStønadType,
        dokumenttype: valgtDokumentType,
        beskrivelse: dokumentTypeTilTekst[valgtDokumentType as DokumentType],
      };
      oppdaterInnsending(oppdatertInnsending);
      return;
    }
    settAlertStripeMelding(alertMelding.MANGLER_BEGGE_TYPER);
  };

  return (
    <Box padding="space-8" borderWidth="1">
      <VStack gap={'2'}>
        {!harLåstValg && (
          <VStack gap={'2'}>
            <Select
              label="Hvilken stønadstype gjelder innsendingen for?"
              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                settValgtStønadType(event.target.value as StønadType);
              }}
              value={valgtStønadType || ''}
              aria-autocomplete={'none'}
            >
              <option value={undefined}>Velg stønadstype</option>
              {stønadsTyper.map((stønadstype) => (
                <option key={stønadstype} value={stønadstype}>
                  {stønadTypeTilTekst[stønadstype]}
                </option>
              ))}
            </Select>
            <Select
              label="Hvilken dokumenttype gjelder innsendingen for?"
              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                settValgtDokumentType(event.target.value as DokumentType);
              }}
              value={valgtDokumentType || ''}
              aria-autocomplete={'none'}
            >
              <option value={undefined}>Velg dokumenttype</option>
              {dokumenttyperForStønad(valgtStønadType).map((dokumenttype) => (
                <option key={dokumenttype} value={dokumenttype}>
                  {dokumentTypeTilTekst[dokumenttype]}
                </option>
              ))}
            </Select>
          </VStack>
        )}

        {harLåstValg && (
          <VStack gap={'2'}>
            <Alert
              variant={erDokumentasjonSendt ? 'success' : 'warning'}
              inline
            >
              <Heading level={'2'} size={'small'}>
                {innsending.beskrivelse}
              </Heading>
            </Alert>
            <BodyLong>
              <strong>Stønadstype: </strong>
              {stønadTypeTilTekst[valgtStønadType as StønadType]}
            </BodyLong>
            <Vedleggsopplaster
              innsending={innsending}
              slettInnsedning={slettEkstraInnsending}
              oppdaterInnsending={oppdaterInnsending}
              maxFilstørrelse={filstørrelse_10MB}
              stønadType={valgtStønadType}
              beskrivelse={
                dokumentTypeTilTekst[valgtDokumentType as DokumentType]
              }
              settAlertStripeMelding={settOverordnetAlertStripeMelding}
            />
          </VStack>
        )}

        {!harLåstValg && (
          <VStack align={'center'}>
            <HStack gap={'2'}>
              <Button
                type={'button'}
                variant={'tertiary'}
                onClick={() => slettEkstraInnsending(innsending.id)}
                title={'Slett opplastede vedlegg'}
              >
                Avbryt
              </Button>
              <Button variant={'secondary'} onClick={håndterKnappeKlikk}>
                Neste
              </Button>
            </HStack>
          </VStack>
        )}

        <AlertStripe melding={alertStripeMelding} />
        {innsendingerUtenVedlegg.includes(innsending.id) && (
          <AlertStripe
            melding={alertMelding.MANGLER_DOKUMENTASJON_I_EKSTRA_BOKS}
          />
        )}
      </VStack>
    </Box>
  );
};
