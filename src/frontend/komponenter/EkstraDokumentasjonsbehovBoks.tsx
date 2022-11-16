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
import KnappMedPadding from '../nav-komponenter/Knapp';
import { Alert, Button } from '@navikt/ds-react';
import { Delete } from '@navikt/ds-icons';

const StyledSelect = styled(Select)`
  margin-top: 1rem;
`;

const StyledPanel = styled(Panel)`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const SekundærKnapp = styled(KnappMedPadding)`
  margin-bottom: 0rem;
`;

const DivMidtstillInnhold = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 34.5rem 3rem;
  align-items: baseline;
`;

const FlexRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: -2.5rem;
`;

const DeleteButton = styled(Button)`
  z-index: 999;
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

  const slettInnsending = () => {
    slettEkstraInnsending(innsending.id);
  };

  return (
    <StyledPanel border>
      {!harLåstValg && (
        <>
          <FlexRow>
            <DeleteButton
              type={'button'}
              variant={'tertiary'}
              icon={<Delete title={'Søppeldunk'} />}
              onClick={slettInnsending}
              title={'Slett opplastede vedlegg'}
            />
          </FlexRow>
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
          <Grid>
            <Alert
              variant={erDokumentasjonSendt ? 'success' : 'warning'}
              inline
            >
              <strong>{innsending.beskrivelse}</strong>
            </Alert>
            <DeleteButton
              type={'button'}
              variant={'tertiary'}
              icon={<Delete title={'Søppeldunk'} />}
              onClick={slettInnsending}
              title={'Slett opplastede vedlegg'}
            />
          </Grid>
          <p>
            <strong>Stønadstype: </strong>
            {stønadTypeTilTekst[valgtStønadType as StønadType]}
          </p>
          <Vedleggsopplaster
            innsending={innsending}
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
        <DivMidtstillInnhold>
          <SekundærKnapp variant={'secondary'} onClick={håndterKnappeKlikk}>
            Neste
          </SekundærKnapp>
        </DivMidtstillInnhold>
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
