import React, { Dispatch, SetStateAction } from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import { Select, Textarea } from 'nav-frontend-skjema';
import styled from 'styled-components/macro';
import { DokumentType } from '../typer/stønad';
import { IInnsending, EttersendingType, IVedlegg } from '../typer/ettersending';
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
  innsending: IInnsending;
  settInnsending: Dispatch<SetStateAction<IInnsending>>;
  tidligereOpplastedeVedlegg: IVedlegg[];
}

const ÅpenEttersendingForSøknad: React.FC<IProps> = ({
  innsending,
  settInnsending,
  tidligereOpplastedeVedlegg,
}: IProps) => {
  const oppdaterBeskrivelse = (beskrivelse: string) => {
    settInnsending({
      ...innsending,
      beskrivelse: beskrivelse,
    });
  };

  const oppdaterDokumenttype = (dokumenttype: string) => {
    settInnsending({
      ...innsending,
      dokumenttype: dokumenttype,
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
        ettersendingType={EttersendingType.ETTERSENDING_MED_SØKNAD_INNSENDING}
        settInnsending={settInnsending}
        innsending={innsending}
      />

      <StyledSelect
        label="Hvilken dokumenttype gjelder innsendingen for?"
        onChange={(event) => oppdaterDokumenttype(event.target.value)}
        value={innsending.dokumenttype}
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
        value={innsending.beskrivelse}
        onChange={(event) => oppdaterBeskrivelse(event.target.value)}
      />
    </StyledEkspanderbartpanel>
  );
};

export default ÅpenEttersendingForSøknad;
