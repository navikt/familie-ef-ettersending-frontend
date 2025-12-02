import React from 'react';
import { IDokumentasjonsbehov } from '../typer/ettersending';
import Vedleggsopplaster from './Vedleggsopplaster';
import { formaterIsoDato } from '../../shared-utils/dato';
import { filstørrelse_10MB } from '../utils/filer';
import {
  BodyLong,
  BodyShort,
  Box,
  Heading,
  HStack,
  ReadMore,
  VStack,
} from '@navikt/ds-react';
import { alertMelding } from './AlertStripe';
import {
  CheckmarkCircleIcon,
  ExclamationmarkTriangleIcon,
} from '@navikt/aksel-icons';

interface Props {
  innsending: IDokumentasjonsbehov;
  oppdaterInnsending: (innsending: IDokumentasjonsbehov) => void;
  settAlertStripeMelding: (melding: alertMelding) => void;
}

export const DokumentasjonsbehovBoks: React.FC<Props> = ({
  innsending,
  oppdaterInnsending,
  settAlertStripeMelding,
}: Props) => {
  const dokumentasjonErOpplastet =
    innsending.søknadsdata?.harSendtInnTidligere ||
    innsending.vedlegg.length > 0;

  const storForbokstav = (ord: string): string => {
    return ord.charAt(0).toUpperCase() + ord.slice(1);
  };

  return (
    <Box padding="space-8" borderWidth="1">
      <VStack gap={'2'}>
        <HStack gap={'2'}>
          {dokumentasjonErOpplastet ? (
            <CheckmarkCircleIcon
              title="Følgende dokumentasjon er lastet opp og klar til å sendes inn:"
              fontSize="1.5rem"
            />
          ) : (
            <ExclamationmarkTriangleIcon
              title="Følgende dokumentasjon er ikke lastet opp:"
              fontSize="1.5rem"
            />
          )}
          <Heading level={'2'} size={'small'}>
            {innsending.beskrivelse}
          </Heading>
        </HStack>

        {innsending.stønadType && (
          <HStack>
            <BodyShort>
              <b>Stønadstype:</b>{' '}
              {storForbokstav(innsending.stønadType.toLocaleLowerCase())}
            </BodyShort>
          </HStack>
        )}

        <ReadMore header={'Derfor spør vi deg om denne dokumentasjonen'}>
          <BodyLong>
            Vi spør deg om dette fordi vi mangler{' '}
            {innsending.beskrivelse?.toLocaleLowerCase()}. Denne dokumentasjonen
            ble ikke sendt inn ved søknadstidspunktet{' '}
            {formaterIsoDato(innsending.søknadsdata?.søknadsdato)}. Du kan se
            bort ifra dette hvis du allerede har sendt oss dokumentasjonen på
            annen måte.
          </BodyLong>
        </ReadMore>

        <Vedleggsopplaster
          innsending={innsending}
          oppdaterInnsending={oppdaterInnsending}
          maxFilstørrelse={filstørrelse_10MB}
          stønadType={innsending.stønadType}
          beskrivelse={innsending.beskrivelse || ''}
          settAlertStripeMelding={settAlertStripeMelding}
        />
      </VStack>
    </Box>
  );
};
