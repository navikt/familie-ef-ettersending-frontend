import React, { useEffect, useState } from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import { Button } from '@navikt/ds-react';
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
import { IDokumentasjonsbehov } from '../typer/ettersending';
import Panel from 'nav-frontend-paneler';
import AlertStripe, { alertMelding } from './AlertStripe';
import { filstørrelse_10MB } from '../utils/filer';
import Alertstripe from 'nav-frontend-alertstriper';

const StyledSelect = styled(Select)`
  margin-top: 1rem;
`;

const StyledPanel = styled(Panel)`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const KnappMedMargin = styled(Button)`
  margin-bottom: 0rem;
`;

const DivMidtstillInnhold = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
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

interface IProps {
  innsending: IDokumentasjonsbehov;
  oppdaterInnsending: (innsending: IDokumentasjonsbehov) => void;
  slettEkstraInnsending: (id: string) => void;
  innsendingerUtenVedlegg: string[];
}

export const EkstraDokumentasjonsbehovBoks: React.FC<IProps> = ({
  innsending,
  oppdaterInnsending,
  slettEkstraInnsending,
  innsendingerUtenVedlegg,
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

  const erDokumentasjonSendt = (): boolean => {
    return (
      innsending.søknadsdata?.harSendtInnTidligere ||
      innsending.vedlegg.length > 0
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
            <span tabIndex={0}>
              <StyledImg
                className="slettikon"
                src={slett}
                alt="Rødt kryss"
                onClick={() => {
                  slettInnsending();
                }}
              />
            </span>
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
            <Alertstripe
              type={erDokumentasjonSendt() ? 'suksess' : 'advarsel'}
              form="inline"
            >
              <b>{innsending.beskrivelse}</b>
            </Alertstripe>
            <span tabIndex={0}>
              <StyledImg
                className="slettikon"
                src={slett}
                alt="Rødt kryss"
                onClick={() => {
                  slettInnsending();
                }}
              />
            </span>
          </StyledDiv>
          <p>
            <b>Stønadstype: </b>
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
          />
        </>
      )}
      {!harLåstValg && (
        <DivMidtstillInnhold>
          <KnappMedMargin variant={'secondary'} onClick={håndterKnappeKlikk}>
            Neste
          </KnappMedMargin>
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
