import React from 'react';
import { IDokumentasjonsbehov } from '../typer/ettersending';
import Panel from 'nav-frontend-paneler';
import styled from 'styled-components';
import Vedleggsopplaster from './Vedleggsopplaster';
import { formaterIsoDato } from '../../shared-utils/dato';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import { Normaltekst } from 'nav-frontend-typografi';
import { LesMerTekst } from './LesMerTekst';
import { filstørrelse_10MB } from '../utils/filer';
import { Alert } from '@navikt/ds-react';
import { alertMelding } from './AlertStripe';

const StyledPanel = styled(Panel)`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const StyledLesMerTekst = styled(LesMerTekst)`
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
  const erDokumentasjonSendt = (): boolean => {
    return (
      innsending.søknadsdata?.harSendtInnTidligere ||
      innsending.vedlegg.length > 0
    );
  };

  const storForbokstav = (ord: string): string => {
    return ord.charAt(0).toUpperCase() + ord.slice(1);
  };

  return (
    <>
      <StyledPanel border>
        <Alert variant={erDokumentasjonSendt() ? 'success' : 'warning'} inline>
          <strong>{innsending.beskrivelse}</strong>
        </Alert>
        {innsending.stønadType && (
          <>
            <p>
              <strong>Stønadstype: </strong>
              {`${storForbokstav(innsending.stønadType.toLocaleLowerCase())}`}
            </p>
          </>
        )}
        <StyledLesMerTekst>
          <Lesmerpanel
            apneTekst={'Derfor spør vi deg om denne dokumentasjonen'}
            lukkTekst={'Derfor spør vi deg om denne dokumentasjonen'}
          >
            <Normaltekst>
              Vi spør deg om dette fordi vi mangler{' '}
              {innsending.beskrivelse?.toLocaleLowerCase()}. Denne
              dokumentasjonen ble ikke sendt inn ved søknadstidspunktet{' '}
              {formaterIsoDato(innsending.søknadsdata?.søknadsdato)}. Du kan se
              bort ifra dette hvis du allerede har sendt oss dokumentasjonen på
              annen måte.
            </Normaltekst>
          </Lesmerpanel>
        </StyledLesMerTekst>
        <Vedleggsopplaster
          innsending={innsending}
          oppdaterInnsending={oppdaterInnsending}
          maxFilstørrelse={filstørrelse_10MB}
          stønadType={innsending.stønadType}
          beskrivelse={innsending.beskrivelse || ''}
          settAlertStripeMelding={settAlertStripeMelding}
        />
      </StyledPanel>
    </>
  );
};
