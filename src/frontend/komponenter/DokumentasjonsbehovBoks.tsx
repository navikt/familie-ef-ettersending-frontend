import React, { Dispatch, SetStateAction, useState } from 'react';
import { EttersendingType } from '../typer/ettersending';
import Panel from 'nav-frontend-paneler';
import styled from 'styled-components';
import { Checkbox } from 'nav-frontend-skjema';
import { IDokumentasjonsbehov } from '../typer/dokumentasjonsbehov';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import Vedleggsopplaster from './Vedleggsopplaster';
import Alertstripe from 'nav-frontend-alertstriper';
import { formaterIsoDato } from '../../shared-utils/dato';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import { Normaltekst } from 'nav-frontend-typografi';
import { LesMerTekst } from './LesMerTekst';

const StyledPanel = styled(Panel)`
  margin: 1rem auto;
`;

const StyledCheckbox = styled(Checkbox)`
  margin: 1rem auto;
  display: inline-block;
`;

const StyledHjelpetekst = styled(Hjelpetekst)`
  margin: 1rem 0.5rem;
`;

const StyledLesMerTekst = styled(LesMerTekst)`
  margin-bottom: 2rem;
`;

interface Props {
  dokumentasjonsbehov: IDokumentasjonsbehov;
  dokumentasjonsbehovTilInnsending: IDokumentasjonsbehov[];
  settDokumentasjonsbehovTilInnsending: Dispatch<
    SetStateAction<IDokumentasjonsbehov[]>
  >;
  stønadstype: string;
  søknadsdato: any;
}

export const DokumentasjonsbehovBoks: React.FC<Props> = ({
  dokumentasjonsbehov,
  settDokumentasjonsbehovTilInnsending,
  dokumentasjonsbehovTilInnsending,
  stønadstype,
  søknadsdato,
}: Props) => {
  const [checked, settCheckboxverdi] = useState<boolean>(
    dokumentasjonsbehov.harSendtInn
  );

  const erDokumentasjonSendt = (): boolean => {
    return (
      dokumentasjonsbehov.harSendtInn ||
      dokumentasjonsbehov.opplastedeVedlegg.length > 0
    );
  };

  const storForbokstav = (ord: string): string => {
    return ord.charAt(0).toUpperCase() + ord.slice(1);
  };

  const oppdaterHarSendtInn = () => {
    const invertedChecked = !checked;
    settCheckboxverdi(invertedChecked);
    const oppdatertDokumentasjonsbehov = dokumentasjonsbehovTilInnsending.map(
      (behov) => {
        if (behov.id == dokumentasjonsbehov.id) {
          return {
            ...behov,
            harSendtInn: invertedChecked,
          };
        } else {
          return behov;
        }
      }
    );
    settDokumentasjonsbehovTilInnsending(oppdatertDokumentasjonsbehov);
  };

  return (
    <>
      <StyledPanel border>
        <Alertstripe
          type={erDokumentasjonSendt() ? 'suksess' : 'advarsel'}
          form="inline"
        >
          <b>{dokumentasjonsbehov.label}</b>
        </Alertstripe>
        <p>
          <b>Stønadstype: </b>
          {`${storForbokstav(stønadstype.toLocaleLowerCase())}`}
        </p>
        <p>{`Søknad om ${stønadstype.toLocaleLowerCase()} ${formaterIsoDato(
          søknadsdato
        )}`}</p>
        <StyledLesMerTekst>
          <Lesmerpanel
            apneTekst={'Hvorfor etterspør vi dette? '}
            lukkTekst={'Hvorfor etterspør vi dette? '}
          >
            <Normaltekst>Lorem ipsum dolor sit amet.</Normaltekst>
          </Lesmerpanel>
        </StyledLesMerTekst>
        {dokumentasjonsbehov.opplastedeVedlegg.length > 0 && (
          <>
            <p>Tidligere opplastede filer:</p>
            <OpplastedeVedlegg
              vedleggsliste={dokumentasjonsbehov.opplastedeVedlegg}
            />
          </>
        )}
        <Vedleggsopplaster
          ettersendingType={
            EttersendingType.ETTERSENDING_MED_SØKNAD_DOKUMENTASJONSBEHOV
          }
          dokumentasjonsbehovId={dokumentasjonsbehov.id}
          dokumentasjonsbehovTilInnsending={dokumentasjonsbehovTilInnsending}
          settDokumentasjonsbehovTilInnsending={
            settDokumentasjonsbehovTilInnsending
          }
        />
        <Normaltekst>
          Dersom dokumentet du skal sende inn består av flere filer kan du legge
          til alle filene her.
        </Normaltekst>
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
