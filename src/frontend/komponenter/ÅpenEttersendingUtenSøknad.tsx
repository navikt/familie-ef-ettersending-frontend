import React, { Dispatch, SetStateAction } from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import { Select, Textarea } from 'nav-frontend-skjema';
import styled from 'styled-components/macro';
import { StønadType, DokumentType } from '../typer/stønad';
import {
  IEttersendingUtenSøknad,
  EttersendingType,
  IVedlegg,
} from '../typer/ettersending';
import OpplastedeVedlegg from './OpplastedeVedlegg';

const StyledSelect = styled(Select)`
  margin-top: 1rem;
`;

const StyledTextarea = styled(Textarea)`
  width: 100%;
  margin-left: 1px;
`;

const StyledEkspanderbartpanel = styled(Ekspanderbartpanel)`
  margin: 1rem auto;
  .textarea__container {
    margin-top: 1rem;
  }
`;

interface IProps {
  ettersendingUtenSøknad: IEttersendingUtenSøknad;
  settEttersendingUtenSøknad: Dispatch<SetStateAction<IEttersendingUtenSøknad>>;
  tidligereOpplastedeVedlegg: IVedlegg[];
}

const ÅpenEttersendingUtenSøknad: React.FC<IProps> = ({
  ettersendingUtenSøknad,
  settEttersendingUtenSøknad,
  tidligereOpplastedeVedlegg,
}: IProps) => {
  const oppdaterBeskrivelse = (beskrivelse: string) => {
    settEttersendingUtenSøknad({
      ...ettersendingUtenSøknad,
      innsending: [
        {
          ...ettersendingUtenSøknad.innsending[0],
          beskrivelse: beskrivelse,
        },
      ],
    });
  };

  const oppdaterDokumenttype = (dokumenttype: string) => {
    settEttersendingUtenSøknad({
      ...ettersendingUtenSøknad,
      innsending: [
        {
          ...ettersendingUtenSøknad.innsending[0],
          dokumenttype: dokumenttype,
        },
      ],
    });
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
      {tidligereOpplastedeVedlegg.length > 0 && (
        <>
          <p>Tidligere opplastede filer:</p>
          <OpplastedeVedlegg vedleggsliste={tidligereOpplastedeVedlegg} />
        </>
      )}
      <Vedleggsopplaster
        ettersendingType={EttersendingType.ETTERSENDING_UTEN_SØKNAD}
        settEttersendingUtenSøknad={settEttersendingUtenSøknad}
        ettersendingUtenSøknad={ettersendingUtenSøknad}
      />
      <StyledSelect
        label="Hvilken stønadstype gjelder innsendingen for?"
        onChange={(event) => oppdaterStønadstype(event.target.value)}
        value={ettersendingUtenSøknad.stønadstype}
      >
        <option value={undefined}>Velg stønadstype</option>
        {(Object.keys(StønadType) as Array<keyof typeof StønadType>).map(
          (stønadType) => (
            <option key={stønadType} value={stønadType}>
              {StønadType[stønadType]}
            </option>
          )
        )}
      </StyledSelect>
      <StyledSelect
        label="Hvilken dokumenttype gjelder innsendingen for?"
        onChange={(event) => oppdaterDokumenttype(event.target.value)}
        value={ettersendingUtenSøknad.innsending[0].dokumenttype}
      >
        <option value={undefined}>Velg dokumenttype</option>
        {(Object.keys(DokumentType) as Array<keyof typeof DokumentType>).map(
          (dokumenttype) => (
            <option key={dokumenttype} value={dokumenttype}>
              {DokumentType[dokumenttype]}
            </option>
          )
        )}
        <option value="Annet">Annet</option>
      </StyledSelect>
      <StyledTextarea
        label="Kommentar til ettersendingen"
        value={ettersendingUtenSøknad.innsending[0].beskrivelse}
        onChange={(event) => oppdaterBeskrivelse(event.target.value)}
      />
    </StyledEkspanderbartpanel>
  );
};

export default ÅpenEttersendingUtenSøknad;
