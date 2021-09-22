import React, { useState } from 'react';
import { IDokumentasjonsbehov } from '../typer/ettersending';
import Panel from 'nav-frontend-paneler';
import styled from 'styled-components';
import { Checkbox } from 'nav-frontend-skjema';
import Vedleggsopplaster from './Vedleggsopplaster';
import Alertstripe from 'nav-frontend-alertstriper';
import { formaterIsoDato } from '../../shared-utils/dato';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { LesMerTekst } from './LesMerTekst';

const StyledPanel = styled(Panel)`
  margin: 1rem auto;
`;

const StyledCheckbox = styled(Checkbox)`
  margin: 1rem auto;
  display: inline-block;
`;

const StyledHjelpetekst = styled(Hjelpetekst)`
  position: relative;
  margin: 1rem 0.5rem;
  top: 6px;
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
  const [checked, settCheckboxverdi] = useState<boolean>(
    innsending.søknadsdata ? innsending.søknadsdata.harSendtInnTidligere : false
  );

  const erDokumentasjonSendt = (): boolean => {
    return (
      innsending.søknadsdata?.harSendtInnTidligere ||
      innsending.vedlegg.length > 0
    );
  };

  const storForbokstav = (ord: string): string => {
    return ord.charAt(0).toUpperCase() + ord.slice(1);
  };

  const oppdaterHarSendtInn = () => {
    const invertedChecked = !checked;
    settCheckboxverdi(invertedChecked);
    if (innsending.søknadsdata) {
      oppdaterInnsending({
        ...innsending,
        søknadsdata: {
          ...innsending.søknadsdata,
          harSendtInnTidligere: invertedChecked,
        },
      });
    }
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
            <p>{`Søknad om ${innsending.stønadType.toLocaleLowerCase()} ${formaterIsoDato(
              innsending.søknadsdata?.søknadsdato
            )}`}</p>
          </>
        )}
        <StyledLesMerTekst>
          <Lesmerpanel
            apneTekst={'Derfor spør vi deg om dette '}
            lukkTekst={'Derfor spør vi deg om dette '}
          >
            <Normaltekst>
              Vi spør deg om dette fordi vi mangler{' '}
              {innsending.beskrivelse?.toLocaleLowerCase()}. Denne
              dokumentasjonen ble ikke sendt inn ved søknadstidspunktet{' '}
              {formaterIsoDato(innsending.søknadsdata?.søknadsdato)}. Du kan se
              bort ifra dette hvis du allerede har sendt oss dokumentasjonen på
              annen måte. Da kan du krysse av på at du har levert på annen måte.
            </Normaltekst>
          </Lesmerpanel>
        </StyledLesMerTekst>
        <Vedleggsopplaster
          innsending={innsending}
          oppdaterInnsending={oppdaterInnsending}
        />
        <Undertekst>
          Dersom dokumentet du skal sende inn består av flere filer kan du legge
          til alle filene her.
        </Undertekst>
        <StyledCheckbox
          onChange={() => oppdaterHarSendtInn()}
          checked={checked}
          label={'Jeg har levert på annen måte'}
        />
        <StyledHjelpetekst>
          Dersom du har levert dokumentasjonen på en annen måte kan du krysse av
          denne boksen.
        </StyledHjelpetekst>
      </StyledPanel>
    </>
  );
};
