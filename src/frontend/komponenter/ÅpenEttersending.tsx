import React, { useState } from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import { Select, Textarea } from 'nav-frontend-skjema';
import styled from 'styled-components/macro';
import { StønadType, DokumentType } from '../typer/stønad';
import {
  IÅpenEttersending,
  IEttersendingUtenSøknad,
} from '../typer/søknadsdata';

const StyledSelect = styled(Select)`
  margin-top: 1rem;
`;

const StyledTextarea = styled(Textarea)`
  width: 100%;
`;

const StyledEkspanderbartpanel = styled(Ekspanderbartpanel)`
  .textarea__container {
    margin-top: 1rem;
  }
`;

interface IProps {
  visStønadstype?: boolean;

  åpenEttersendingMedSøknad?: IÅpenEttersending;
  settÅpenEttersendingMedSøknad?: (
    dokumentasjonsbehov: IÅpenEttersending
  ) => void;

  ettersendingUtenSøknad?: IEttersendingUtenSøknad;
  settEttersendingUtenSøknad?: (
    dokumentasjonsbehov: IEttersendingUtenSøknad
  ) => void;
}

const ÅpenEttersending = ({
  visStønadstype,
  åpenEttersendingMedSøknad,
  settÅpenEttersendingMedSøknad,
  ettersendingUtenSøknad,
  settEttersendingUtenSøknad,
}: IProps) => {
  const [stønadstype, settStønadstype] = useState<string>('');
  const [dokumenttype, settDokumenttype] = useState<string>('');
  const [beskrivelse, settBeskrivelse] = useState<string>('');

  const oppdaterBeskrivelse = (beskrivelse: string) => {
    settBeskrivelse(beskrivelse);
    if (visStønadstype) {
      settEttersendingUtenSøknad({
        ...ettersendingUtenSøknad,
        åpenEttersending: {
          ...ettersendingUtenSøknad.åpenEttersending,
          beskrivelse: beskrivelse,
        },
      });
    } else {
      settÅpenEttersendingMedSøknad({
        ...åpenEttersendingMedSøknad,
        beskrivelse: beskrivelse,
      });
    }
  };

  const oppdaterDokumenttype = (dokumenttype: string) => {
    settDokumenttype(dokumenttype);
    if (visStønadstype) {
      settEttersendingUtenSøknad({
        ...ettersendingUtenSøknad,
        åpenEttersending: {
          ...ettersendingUtenSøknad.åpenEttersending,
          dokumenttype: dokumenttype,
        },
      });
    } else {
      settÅpenEttersendingMedSøknad({
        ...åpenEttersendingMedSøknad,
        dokumenttype: dokumenttype,
      });
    }
  };

  const oppdaterStønadstype = (stønadstype: string) => {
    settStønadstype(stønadstype);
    settEttersendingUtenSøknad({
      ...ettersendingUtenSøknad,
      stønadstype: stønadstype,
    });
  };

  return (
    <StyledEkspanderbartpanel
      tittel={
        <Alertstripe type="info" form="inline">
          Åpen ettersending
        </Alertstripe>
      }
    >
      <Vedleggsopplaster
        settÅpenEttersendingMedSøknad={settÅpenEttersendingMedSøknad}
        åpenEttersendingMedSøknad={åpenEttersendingMedSøknad}
        settEttersendingUtenSøknad={settEttersendingUtenSøknad}
        ettersendingUtenSøknad={ettersendingUtenSøknad}
      />
      {visStønadstype && (
        <StyledSelect
          label="Hvilken stønadstype gjelder innsendingen for?"
          onChange={(event) => oppdaterStønadstype(event.target.value)}
        >
          <option value="">Velg stønadstype</option>
          <option value={StønadType.OVERGANGSSTØNAD}>
            {StønadType.OVERGANGSSTØNAD}
          </option>
          <option value={StønadType.BARNETILSYN}>
            {StønadType.BARNETILSYN}
          </option>
          <option value={StønadType.SKOLEPENGER}>
            {StønadType.SKOLEPENGER}
          </option>
        </StyledSelect>
      )}

      <StyledSelect
        label="Hvilken dokumenttype gjelder innsendingen for?"
        onChange={(event) => oppdaterDokumenttype(event.target.value)}
      >
        <option value="">Velg dokumenttype</option>
        {Object.keys(DokumentType).map((dokumenttype) => (
          <option key={dokumenttype} value={DokumentType[dokumenttype]}>
            {DokumentType[dokumenttype]}
          </option>
        ))}
        <option value="Annet">Annet</option>
      </StyledSelect>
      <StyledTextarea
        label="Kommentar til ettersendingen"
        value={beskrivelse}
        onChange={(event) => oppdaterBeskrivelse(event.target.value)}
      />
    </StyledEkspanderbartpanel>
  );
};

export default ÅpenEttersending;
