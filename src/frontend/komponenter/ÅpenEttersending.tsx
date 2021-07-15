import React, { useState } from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import { Select, Textarea } from 'nav-frontend-skjema';
import styled from 'styled-components/macro';
import { StønadType } from '../typer/stønad';

const StyledSelect = styled(Select)`
  margin: 1rem auto;
`;

const StyledTextarea = styled(Textarea)`
  width: 100%;
`;

interface IÅpenEttersending {
  visStønadsType?: boolean;
}

const ÅpenEttersending = ({ visStønadsType }: IÅpenEttersending) => {
  const [stønadsType, settStønadsType] = useState<string>('');
  const [kommentar, settKommentar] = useState<string>('');

  return (
    <Ekspanderbartpanel
      tittel={
        <Alertstripe type="info" form="inline">
          Åpen innsending
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
      <StyledTextarea
        label="Kommentar til ettersendingen"
        value={kommentar}
        onChange={(event) => settKommentar(event.target.value)}
      />
    </Ekspanderbartpanel>
  );
};

export default ÅpenEttersending;
