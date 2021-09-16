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
import { IDokumentasjonsbehovTilBackend } from '../typer/ettersending';
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
  innsending: IDokumentasjonsbehovTilBackend;
  oppdaterInnsending: (innsending: IDokumentasjonsbehovTilBackend) => void;
  slettEkstraInnsending: (id: string) => void;
}

export const EkstraDokumentasjonsbehovBoks: React.FC<IProps> = ({
  innsending,
  oppdaterInnsending,
  slettEkstraInnsending,
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
          <StyledDiv>
            <b> </b>
            <StyledImg
              className="slettikon"
              src={slett}
              alt="Rødt kryss"
              onClick={() => {
                slettInnsending();
              }}
            />
          </StyledDiv>
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
            innsending={innsending}
            oppdaterInnsending={oppdaterInnsending}
          />
          <StyledUndertekst>
            Dersom dokumentet du skal sende inn består av flere filer kan du
            legge til alle filene her.
          </StyledUndertekst>
        </>
      )}
      {!harLåstValg && (
        <div>
          <StyledKnapp onClick={håndterKnappeKlikk}>Neste</StyledKnapp>
        </div>
      )}
      <StyledAlertStripe melding={alertStripeMelding} />
    </StyledPanel>
  );
};
