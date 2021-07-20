import React, { useState } from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import { Select, Textarea } from 'nav-frontend-skjema';
import styled from 'styled-components/macro';
import { StønadType, DokumentType } from '../typer/stønad';
import { IInnsending, IEttersendingUtenSøknad } from '../typer/ettersending';

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

  innsending?: IInnsending;
  settInnsending?: (dokumentasjonsbehov: IInnsending) => void;

  ettersendingUtenSøknad?: IEttersendingUtenSøknad;
  settEttersendingUtenSøknad?: (
    dokumentasjonsbehov: IEttersendingUtenSøknad
  ) => void;
}

const ÅpenEttersending = ({
  visStønadstype,
  innsending,
  settInnsending,
  ettersendingUtenSøknad,
  settEttersendingUtenSøknad,
}: IProps) => {
  const [beskrivelse, settBeskrivelse] = useState<string>('');

  const oppdaterBeskrivelse = (beskrivelse: string) => {
    settBeskrivelse(beskrivelse);
    if (visStønadstype) {
      settEttersendingUtenSøknad({
        ...ettersendingUtenSøknad,
        innsending: [
          {
            ...ettersendingUtenSøknad.innsending[0],
            beskrivelse: beskrivelse,
          },
        ],
      });
    } else {
      settInnsending({
        ...innsending,
        beskrivelse: beskrivelse,
      });
    }
  };

  const oppdaterDokumenttype = (dokumenttype: string) => {
    if (visStønadstype) {
      settEttersendingUtenSøknad({
        ...ettersendingUtenSøknad,
        innsending: [
          {
            ...ettersendingUtenSøknad.innsending[0],
            dokumenttype: dokumenttype,
          },
        ],
      });
    } else {
      settInnsending({
        ...innsending,
        dokumenttype: dokumenttype,
      });
    }
  };

  const oppdaterStønadstype = (stønadstype: string) => {
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
        settInnsending={settInnsending}
        innsending={innsending}
        settEttersendingUtenSøknad={settEttersendingUtenSøknad}
        ettersendingUtenSøknad={ettersendingUtenSøknad}
      />
      {visStønadstype && (
        <StyledSelect
          label="Hvilken stønadstype gjelder innsendingen for?"
          onChange={(event) => oppdaterStønadstype(event.target.value)}
        >
          <option value="">Velg stønadstype</option>
          {Object.keys(StønadType).map((stønadType) => (
            <option key={stønadType} value={stønadType}>
              {stønadType}
            </option>
          ))}
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
