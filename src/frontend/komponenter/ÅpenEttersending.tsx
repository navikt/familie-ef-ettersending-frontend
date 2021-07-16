import React, { useState } from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import { Select, Textarea } from 'nav-frontend-skjema';
import styled from 'styled-components/macro';
import { StønadType, DokumentType } from '../typer/stønad';

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

interface IÅpenEttersending {
  visStønadsType?: boolean;
}

const ÅpenEttersending = ({ visStønadsType }: IÅpenEttersending) => {
  const [stønadsType, settStønadsType] = useState<string>('');
  const [dokumentType, settDokumentType] = useState<string>('');
  const [kommentar, settKommentar] = useState<string>('');

  return (
    <StyledEkspanderbartpanel
      tittel={
        <Alertstripe type="info" form="inline">
          Åpen ettersending
        </Alertstripe>
      }
    >
      <Vedleggsopplaster />
      {visStønadsType && (
        <StyledSelect
          label="Hvilken stønadstype gjelder innsendingen for?"
          onChange={(event) => settStønadsType(event.target.value)}
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
        onChange={(event) => settDokumentType(event.target.value)}
      >
        <option value="">Velg dokumenttype</option>
        {Object.keys(DokumentType).map((dokumentType) => (
          <option key={dokumentType} value={DokumentType[dokumentType]}>
            {DokumentType[dokumentType]}
          </option>
        ))}
        <option value="Annet">Annet</option>
      </StyledSelect>
      <StyledTextarea
        label="Kommentar til ettersendingen"
        value={kommentar}
        onChange={(event) => settKommentar(event.target.value)}
      />
    </StyledEkspanderbartpanel>
  );
};

export default ÅpenEttersending;
