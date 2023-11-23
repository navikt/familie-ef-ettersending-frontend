import React from 'react';
import { IDokumentasjonsbehov } from '../typer/ettersending';
import styled from 'styled-components';
import Vedleggsopplaster from './Vedleggsopplaster';
import { formaterIsoDato } from '../../shared-utils/dato';
import { filstørrelse_10MB } from '../utils/filer';
import {
  BodyLong,
  BodyShort,
  Heading,
  Label,
  Panel,
  ReadMore,
} from '@navikt/ds-react';
import { alertMelding } from './AlertStripe';
import { SuccessColored, WarningColored } from '@navikt/ds-icons';

const StyledPanel = styled(Panel)`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const StyledBodyShort = styled(BodyShort)`
  margin-left: 0.25rem;
  align-self: baseline;
`;

const StyledLabel = styled(Label)`
  align-self: baseline;
`;

const ReadMoreContainer = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 2rem;
`;

const FlexBox = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
`;

const Tittel = styled.span`
  display: inline-grid;
  grid-template-columns: 1.5rem auto;
  column-gap: 0.75rem;
`;

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
    <StyledPanel border>
      <Tittel>
        {dokumentasjonErOpplastet ? (
          <SuccessColored
            height={'1.5rem'}
            width={'1.5rem'}
            title={
              'Følgende dokumentasjon er lastet opp og klar til å sendes inn:'
            }
          />
        ) : (
          <WarningColored
            height={'1.5rem'}
            width={'1.5rem'}
            title={'Følgende dokumentasjon er ikke lastet opp:'}
          />
        )}
        <Heading level={'2'} size={'small'}>
          {innsending.beskrivelse}
        </Heading>
      </Tittel>
      {innsending.stønadType && (
        <FlexBox>
          <StyledLabel>Stønadstype: </StyledLabel>
          <StyledBodyShort>
            {`${storForbokstav(innsending.stønadType.toLocaleLowerCase())}`}
          </StyledBodyShort>
        </FlexBox>
      )}
      <ReadMoreContainer>
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
      </ReadMoreContainer>
      <Vedleggsopplaster
        innsending={innsending}
        oppdaterInnsending={oppdaterInnsending}
        maxFilstørrelse={filstørrelse_10MB}
        stønadType={innsending.stønadType}
        beskrivelse={innsending.beskrivelse || ''}
        settAlertStripeMelding={settAlertStripeMelding}
      />
    </StyledPanel>
  );
};
