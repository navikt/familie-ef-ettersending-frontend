import React, { ChangeEvent, useEffect, useState } from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import { Select } from 'nav-frontend-skjema';
import styled from 'styled-components/macro';
import {
  DokumentType,
  dokumenttyperForStønad,
  dokumentTypeTilTekst,
  stønadsTyper,
  StønadType,
  stønadTypeTilTekst,
} from '../typer/stønad';
import { IDokumentasjonsbehov } from '../typer/ettersending';
import Panel from 'nav-frontend-paneler';
import AlertStripe, { alertMelding } from './AlertStripe';
import { filstørrelse_10MB } from '../utils/filer';
import KnappMedPadding from '../felles/Knapp';
import { Alert } from '@navikt/ds-react';

const StyledSelect = styled(Select)`
  margin-top: 1rem;
`;

const StyledPanel = styled(Panel)`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const FlexBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const KnappMedMargin = styled(KnappMedPadding)`
  margin: 1rem 0.5rem 0rem 0.5rem;
`;

const StyledAlertStripe = styled(AlertStripe)`
  margin-top: 1rem;
`;

interface IProps {
  innsending: IDokumentasjonsbehov;
  oppdaterInnsending: (innsending: IDokumentasjonsbehov) => void;
  slettEkstraInnsending: (id: string) => void;
  innsendingerUtenVedlegg: string[];
  settOverordnetAlertStripeMelding: (melding: alertMelding) => void;
}

export const EkstraDokumentasjonsbehovBoks: React.FC<IProps> = ({
  innsending,
  oppdaterInnsending,
  slettEkstraInnsending,
  innsendingerUtenVedlegg,
  settOverordnetAlertStripeMelding,
}: IProps) => {
  const [valgtDokumentType, settValgtDokumentType] = useState<string>();
  const [valgtStønadType, settValgtStønadType] = useState<StønadType>();
  const [harLåstValg, settHarLåstValg] = useState<boolean>(false);
  const [alertStripeMelding, settAlertStripeMelding] = useState<alertMelding>(
    alertMelding.TOM
  );

  useEffect(() => {
    if (innsending.vedlegg.length > 0) settHarLåstValg(true);
    settValgtDokumentType(innsending.dokumenttype);
    settValgtStønadType(innsending.stønadType);
  }, []);

  const dokumentTypeOgStønadTypeErValgt = (): boolean => {
    return !!(
      valgtDokumentType &&
      valgtStønadType &&
      valgtDokumentType !== ('Velg dokumenttype' as DokumentType) &&
      valgtStønadType !== ('Velg stønadstype' as StønadType)
    );
  };

  const erDokumentasjonSendt =
    innsending.søknadsdata?.harSendtInnTidligere ||
    innsending.vedlegg.length > 0;

  const låsValg = (bool: boolean) => {
    settHarLåstValg(bool);
  };

  const håndterKnappeKlikk = () => {
    if (dokumentTypeOgStønadTypeErValgt()) {
      settAlertStripeMelding(alertMelding.TOM);
      låsValg(true);
      const oppdatertInnsending = {
        ...innsending,
        stønadType: valgtStønadType,
        dokumenttype: valgtDokumentType,
        beskrivelse: dokumentTypeTilTekst[valgtDokumentType as DokumentType],
      };
      oppdaterInnsending(oppdatertInnsending);
      return;
    }
    settAlertStripeMelding(alertMelding.MANGLER_BEGGE_TYPER);
  };

  return (
    <StyledPanel border>
      {!harLåstValg && (
        <>
          <StyledSelect
            label="Hvilken stønadstype gjelder innsendingen for?"
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              settValgtStønadType(event.target.value as StønadType);
            }}
            value={valgtStønadType || ''}
            autoComplete={'off'}
          >
            <option value={undefined}>Velg stønadstype</option>
            {stønadsTyper.map((stønadstype) => (
              <option key={stønadstype} value={stønadstype}>
                {stønadTypeTilTekst[stønadstype]}
              </option>
            ))}
          </StyledSelect>
          <StyledSelect
            label="Hvilken dokumenttype gjelder innsendingen for?"
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              settValgtDokumentType(event.target.value as DokumentType);
            }}
            value={valgtDokumentType || ''}
            autoComplete={'off'}
          >
            <option value={undefined}>Velg dokumenttype</option>
            {dokumenttyperForStønad(valgtStønadType).map((dokumenttype) => (
              <option key={dokumenttype} value={dokumenttype}>
                {dokumentTypeTilTekst[dokumenttype]}
              </option>
            ))}
          </StyledSelect>
        </>
      )}
      {harLåstValg && (
        <>
          <Alert variant={erDokumentasjonSendt ? 'success' : 'warning'} inline>
            <strong>{innsending.beskrivelse}</strong>
          </Alert>
          <p>
            <strong>Stønadstype: </strong>
            {stønadTypeTilTekst[valgtStønadType as StønadType]}
          </p>
          <Vedleggsopplaster
            innsending={innsending}
            slettInnsedning={slettEkstraInnsending}
            oppdaterInnsending={oppdaterInnsending}
            maxFilstørrelse={filstørrelse_10MB}
            stønadType={valgtStønadType}
            beskrivelse={
              dokumentTypeTilTekst[valgtDokumentType as DokumentType]
            }
            settAlertStripeMelding={settOverordnetAlertStripeMelding}
          />
        </>
      )}
      {!harLåstValg && (
        <FlexBox>
          <KnappMedMargin
            type={'button'}
            variant={'tertiary'}
            onClick={() => slettEkstraInnsending(innsending.id)}
            title={'Slett opplastede vedlegg'}
          >
            Avbryt
          </KnappMedMargin>
          <KnappMedMargin variant={'secondary'} onClick={håndterKnappeKlikk}>
            Neste
          </KnappMedMargin>
        </FlexBox>
      )}
      <StyledAlertStripe melding={alertStripeMelding} />
      {innsendingerUtenVedlegg.includes(innsending.id) && (
        <StyledAlertStripe
          melding={alertMelding.MANGLER_DOKUMENTASJON_I_EKSTRA_BOKS}
        />
      )}
    </StyledPanel>
  );
};
