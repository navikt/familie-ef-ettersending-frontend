import React, { Dispatch, SetStateAction, useState } from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import { Select, Textarea } from 'nav-frontend-skjema';
import styled from 'styled-components/macro';
import { StønadType, DokumentType } from '../typer/stønad';
import {
  IInnsending,
  IEttersendingUtenSøknad,
  EttersendingType,
} from '../typer/ettersending';

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

type Props = { ettersendingType: EttersendingType } & (
  | {
      ettersendingType: EttersendingType.ETTERSENDING_MED_SØKNAD_INNSENDING;
      innsending: IInnsending;
      settInnsending: Dispatch<SetStateAction<IInnsending>>;
    }
  | {
      ettersendingType: EttersendingType.ETTERSENDING_UTEN_SØKNAD;
      ettersendingUtenSøknad: IEttersendingUtenSøknad;
      settEttersendingUtenSøknad: Dispatch<
        SetStateAction<IEttersendingUtenSøknad>
      >;
    }
);

const ÅpenEttersending: React.FC<Props> = (props: Props) => {
  const [beskrivelse, settBeskrivelse] = useState<string>('');

  const oppdaterBeskrivelse = (beskrivelse: string) => {
    settBeskrivelse(beskrivelse);
    if (props.ettersendingType === EttersendingType.ETTERSENDING_UTEN_SØKNAD) {
      const { settEttersendingUtenSøknad, ettersendingUtenSøknad } = props;
      settEttersendingUtenSøknad({
        ...ettersendingUtenSøknad,
        innsending: [
          {
            ...ettersendingUtenSøknad.innsending[0],
            beskrivelse: beskrivelse,
          },
        ],
      });
    } else if (
      props.ettersendingType ===
      EttersendingType.ETTERSENDING_MED_SØKNAD_INNSENDING
    ) {
      const { settInnsending, innsending } = props;
      settInnsending({
        ...innsending,
        beskrivelse: beskrivelse,
      });
    }
  };

  const oppdaterDokumenttype = (dokumenttype: string) => {
    if (props.ettersendingType === EttersendingType.ETTERSENDING_UTEN_SØKNAD) {
      const { settEttersendingUtenSøknad, ettersendingUtenSøknad } = props;
      settEttersendingUtenSøknad({
        ...ettersendingUtenSøknad,
        innsending: [
          {
            ...ettersendingUtenSøknad.innsending[0],
            dokumenttype: dokumenttype,
          },
        ],
      });
    } else if (
      props.ettersendingType ===
      EttersendingType.ETTERSENDING_MED_SØKNAD_INNSENDING
    ) {
      const { settInnsending, innsending } = props;
      settInnsending({
        ...innsending,
        dokumenttype: dokumenttype,
      });
    }
  };

  const oppdaterStønadstype = (stønadstype: string) => {
    if (props.ettersendingType === EttersendingType.ETTERSENDING_UTEN_SØKNAD) {
      const { settEttersendingUtenSøknad, ettersendingUtenSøknad } = props;
      settEttersendingUtenSøknad({
        ...ettersendingUtenSøknad,
        stønadstype: stønadstype,
      });
    }
  };

  return (
    <StyledEkspanderbartpanel
      tittel={
        <Alertstripe type="info" form="inline">
          Åpen ettersending
        </Alertstripe>
      }
    >
      {props.ettersendingType ===
        EttersendingType.ETTERSENDING_MED_SØKNAD_INNSENDING && (
        <Vedleggsopplaster
          ettersendingType={props.ettersendingType}
          settInnsending={props.settInnsending}
          innsending={props.innsending}
        />
      )}

      {props.ettersendingType === EttersendingType.ETTERSENDING_UTEN_SØKNAD && (
        <>
          <Vedleggsopplaster
            ettersendingType={props.ettersendingType}
            settEttersendingUtenSøknad={props.settEttersendingUtenSøknad}
            ettersendingUtenSøknad={props.ettersendingUtenSøknad}
          />
          <StyledSelect
            label="Hvilken stønadstype gjelder innsendingen for?"
            onChange={(event) => oppdaterStønadstype(event.target.value)}
          >
            <option value="">Velg stønadstype</option>
            {(Object.keys(StønadType) as Array<keyof typeof StønadType>).map(
              (stønadType) => (
                <option key={stønadType} value={stønadType}>
                  {StønadType[stønadType]}
                </option>
              )
            )}
          </StyledSelect>
        </>
      )}

      <StyledSelect
        label="Hvilken dokumenttype gjelder innsendingen for?"
        onChange={(event) => oppdaterDokumenttype(event.target.value)}
      >
        <option value="">Velg dokumenttype</option>
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
        value={beskrivelse}
        onChange={(event) => oppdaterBeskrivelse(event.target.value)}
      />
    </StyledEkspanderbartpanel>
  );
};

export default ÅpenEttersending;
