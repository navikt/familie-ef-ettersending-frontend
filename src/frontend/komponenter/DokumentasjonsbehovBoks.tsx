import React from 'react';
import { IDokumentasjonsbehov } from '../typer/ettersending';
import Panel from 'nav-frontend-paneler';
import styled from 'styled-components';
import Vedleggsopplaster from './Vedleggsopplaster';
import Alertstripe from 'nav-frontend-alertstriper';
import { formaterIsoDato } from '../../shared-utils/dato';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { LesMerTekst } from './LesMerTekst';
import { filstørrelse_10MB } from '../utils/filer';

const StyledPanel = styled(Panel)`
  margin: 1rem auto;
`;

const StyledLesMerTekst = styled(LesMerTekst)`
  margin-bottom: 2rem;
`;

interface Props {
  innsending: IDokumentasjonsbehov;
  oppdaterInnsending: (innsending: IDokumentasjonsbehov) => void;
}

export const DokumentasjonsbehovBoks: React.FC<Props> = ({
  innsending,
  oppdaterInnsending,
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
        <Alertstripe
          type={erDokumentasjonSendt() ? 'suksess' : 'advarsel'}
          form="inline"
        >
          <b>{innsending.beskrivelse}</b>
        </Alertstripe>
        {innsending.stønadType && (
          <>
            <p>
              <b>Stønadstype: </b>
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
        />
        <Undertekst>
          Hvis dokumentet du skal sende inn består av flere filer, kan du legge
          til alle filene her.
        </Undertekst>
      </StyledPanel>
    </>
  );
};
