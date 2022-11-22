import React from 'react';
import { IDokumentasjonsbehov } from '../typer/ettersending';
import styled from 'styled-components';
import Vedleggsopplaster from './Vedleggsopplaster';
import { formaterIsoDato } from '../../shared-utils/dato';
import { filstørrelse_10MB } from '../utils/filer';
import { Alert, BodyLong, Heading, Panel, ReadMore } from '@navikt/ds-react';
import { alertMelding } from './AlertStripe';

const StyledPanel = styled(Panel)`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const StyledBodyLong = styled(BodyLong)`
  margin-top: 1rem;
`;

const ReadMoreContainer = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 2rem;
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
  const erDokumentasjonSendt =
    innsending.søknadsdata?.harSendtInnTidligere ||
    innsending.vedlegg.length > 0;

  const storForbokstav = (ord: string): string => {
    return ord.charAt(0).toUpperCase() + ord.slice(1);
  };

  return (
    <StyledPanel border>
      <Alert variant={erDokumentasjonSendt ? 'success' : 'warning'} inline>
        <Heading level={'2'} size={'small'}>
          {innsending.beskrivelse}
        </Heading>
      </Alert>
      {innsending.stønadType && (
        <StyledBodyLong>
          <strong>Stønadstype: </strong>
          {`${storForbokstav(innsending.stønadType.toLocaleLowerCase())}`}
        </StyledBodyLong>
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
