import React, { useEffect, useState } from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import { Knapp } from 'nav-frontend-knapper';
import { Undertekst } from 'nav-frontend-typografi';
import { Select } from 'nav-frontend-skjema';
import slett from '../icons/slett.svg';
import styled from 'styled-components/macro';
import {
  DokumentType,
  dokumenttyperForStønad,
  dokumentTypeTilTekst,
  stønadsTyper,
  StønadType,
  stønadTypeTilTekst,
} from '../typer/stønad';
import { IInnsendingX } from '../typer/ettersending';
import Panel from 'nav-frontend-paneler';
import AlertStripe, { alertMelding } from './AlertStripe';

const StyledSelect = styled(Select)`
  margin-top: 1rem;
`;

const StyledPanel = styled(Panel)`
  margin: 1rem auto;
`;

const StyledKnapp = styled(Knapp)`
  margin: 1rem auto;
  display: flex;
`;

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledImg = styled.img`
  cursor: pointer;
`;

const StyledAlertStripe = styled(AlertStripe)`
  margin-top: 1rem;
`;

const StyledUndertekst = styled(Undertekst)`
  margin-bottom: 1rem;
`;

interface IProps {
  innsendingx: IInnsendingX;
  oppdaterInnsendingx: (innsending: IInnsendingX) => void;
  slettEkstraInnsending: (id: string) => void;
}

export const EkstraDokumentasjonsbehovBoks: React.FC<IProps> = ({
  innsendingx,
  oppdaterInnsendingx,
  slettEkstraInnsending,
}: IProps) => {
  const [valgtDokumentType, settValgtDokumentType] = useState<DokumentType>();
  const [valgtStønadType, settValgtStønadType] = useState<StønadType>();
  const [harLåstValg, settHarLåstValg] = useState<boolean>(false);
  const [alertStripeMelding, settAlertStripeMelding] = useState<alertMelding>(
    alertMelding.TOM
  );

  useEffect(() => {
    if (innsendingx.vedlegg.length > 0) settHarLåstValg(true);
    settValgtDokumentType(innsendingx.dokumenttype);
    settValgtStønadType(innsendingx.stønadType);
  }, []);

  const dokumentTypeOgStønadTypeErValgt = (): boolean => {
    return !!(
      valgtDokumentType &&
      valgtStønadType &&
      valgtDokumentType !== ('Velg dokumenttype' as DokumentType) &&
      valgtStønadType !== ('Velg stønadstype' as StønadType)
    );
  };

  const låsValg = (bool: boolean) => {
    settHarLåstValg(bool);
  };

  const håndterKnappeKlikk = () => {
    if (dokumentTypeOgStønadTypeErValgt()) {
      settAlertStripeMelding(alertMelding.TOM);
      låsValg(true);
      const oppdatertInnsending = {
        ...innsendingx,
        stønadType: valgtStønadType,
        dokumenttype: valgtDokumentType,
        beskrivelse: dokumentTypeTilTekst[valgtDokumentType as DokumentType],
      };
      oppdaterInnsendingx(oppdatertInnsending);
      return;
    }
    settAlertStripeMelding(alertMelding.MANGLER_BEGGE_TYPER);
  };

  const slettInnsending = () => {
    slettEkstraInnsending(innsendingx.id);
  };

  return (
    <StyledPanel border>
      {!harLåstValg && (
        <>
          <StyledSelect
            label="Hvilken stønadstype gjelder innsendingen for?"
            onChange={(event) => {
              settValgtStønadType(event.target.value as StønadType);
            }}
            value={valgtStønadType || ''}
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
            onChange={(event) => {
              settValgtDokumentType(event.target.value as DokumentType);
            }}
            value={valgtDokumentType || ''}
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
          <StyledDiv>
            <b>{dokumentTypeTilTekst[valgtDokumentType as DokumentType]}</b>
            <StyledImg
              className="slettikon"
              src={slett}
              alt="Rødt kryss"
              onClick={() => {
                slettInnsending();
              }}
            />
          </StyledDiv>
          <p>
            <b>Stønadstype: </b>
            {stønadTypeTilTekst[valgtStønadType as StønadType]}
          </p>
          <Vedleggsopplaster
            innsendingx={innsendingx}
            oppdaterInnsendingx={oppdaterInnsendingx}
          />
          <StyledUndertekst>
            Dersom dokumentet du skal sende inn består av flere filer kan du
            legge til alle filene her.
          </StyledUndertekst>
        </>
      )}
      {!harLåstValg && (
        <StyledKnapp onClick={håndterKnappeKlikk}>Neste</StyledKnapp>
      )}
      <StyledAlertStripe melding={alertStripeMelding} />
    </StyledPanel>
  );
};
