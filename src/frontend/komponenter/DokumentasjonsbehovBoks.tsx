import React, { useState } from 'react';
import { IInnsendingX } from '../typer/ettersending';
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
  innsendingx: IInnsendingX;
  oppdaterInnsendingx: (innsending: IInnsendingX) => void;
}

export const DokumentasjonsbehovBoks: React.FC<Props> = ({
  innsendingx,
  oppdaterInnsendingx,
}: Props) => {
  const [checked, settCheckboxverdi] = useState<boolean>(
    innsendingx.søknadsdata.harSendtInnTidligere
  );

  const erDokumentasjonSendt = (): boolean => {
    return (
      innsendingx.søknadsdata.harSendtInnTidligere ||
      innsendingx.vedlegg.length > 0
    );
  };

  const storForbokstav = (ord: string): string => {
    return ord.charAt(0).toUpperCase() + ord.slice(1);
  };

  const oppdaterHarSendtInn = () => {
    const invertedChecked = !checked;
    settCheckboxverdi(invertedChecked);
    oppdaterInnsendingx({
      ...innsendingx,
      søknadsdata: {
        ...innsendingx.søknadsdata,
        harSendtInnTidligere: invertedChecked,
      },
    });
  };

  return (
    <>
      <StyledPanel border>
        <Alertstripe
          type={erDokumentasjonSendt() ? 'suksess' : 'advarsel'}
          form="inline"
        >
          <b>{innsendingx.beskrivelse}</b>
        </Alertstripe>
        {innsendingx.stønadType && (
          <>
            <p>
              <b>Stønadstype: </b>
              {`${storForbokstav(innsendingx.stønadType.toLocaleLowerCase())}`}
            </p>
            <p>{`Søknad om ${innsendingx.stønadType.toLocaleLowerCase()} ${formaterIsoDato(
              innsendingx.søknadsdata.søknadDato
            )}`}</p>
          </>
        )}
        <StyledLesMerTekst>
          <Lesmerpanel
            apneTekst={'Hvorfor etterspør vi dette? '}
            lukkTekst={'Hvorfor etterspør vi dette? '}
          >
            <Normaltekst>Lorem ipsum dolor sit amet.</Normaltekst>
          </Lesmerpanel>
        </StyledLesMerTekst>
        <Vedleggsopplaster
          innsendingx={innsendingx}
          oppdaterInnsendingx={oppdaterInnsendingx}
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
        <StyledHjelpetekst>Lorem ipsum dolor sit amet.</StyledHjelpetekst>
      </StyledPanel>
    </>
  );
};
