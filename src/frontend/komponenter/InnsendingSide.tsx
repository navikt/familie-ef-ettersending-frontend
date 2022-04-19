import React from 'react';
import { DokumentasjonsbehovListe } from './DokumentasjonsbehovListe';
import { EkstraDokumentasjonsbehovBoks } from './EkstraDokumentasjonsbehovBoks';
import { LeggTilInnsending } from './LeggTilInnsending';
import { IDokumentasjonsbehov, IEttersending } from '../typer/ettersending';
import styled from 'styled-components';
import KnappMedPadding from '../nav-komponenter/Knapp';
import { alertMelding } from './AlertStripe';

interface IProps {
  ettersending: IEttersending;
  oppdaterInnsending: (innsending: IDokumentasjonsbehov) => void;
  slettInnsending: (id: string) => void;
  leggTilNyDokumentasjonsbehovBoks: () => void;
  ekstraInnsendingerId: string[];
  visOppsummering: () => void;
  ekstraInnsendingerUtenVedlegg: string[];
  settAlertStripeMelding: (melding: alertMelding) => void;
}

const SoknadContainer = styled.div`
  padding-bottom: 0rem;
`;

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const HovedKnapp = styled(KnappMedPadding)`
  margin: 1rem;
  margin-bottom: 0rem;
`;

export const InnsendingSide: React.FC<IProps> = ({
  ettersending,
  oppdaterInnsending,
  slettInnsending,
  leggTilNyDokumentasjonsbehovBoks,
  ekstraInnsendingerId,
  visOppsummering,
  ekstraInnsendingerUtenVedlegg,
  settAlertStripeMelding,
}: IProps) => {
  return (
    <>
      {ettersending.dokumentasjonsbehov
        .filter((innsending) => !ekstraInnsendingerId.includes(innsending.id))
        .map((innsending) => {
          return (
            <SoknadContainer key={innsending.id}>
              <DokumentasjonsbehovListe
                innsending={innsending}
                oppdaterInnsending={oppdaterInnsending}
                settAlertStripeMelding={settAlertStripeMelding}
              />
            </SoknadContainer>
          );
        })}
      {ettersending.dokumentasjonsbehov
        .filter((innsending) => ekstraInnsendingerId.includes(innsending.id))
        .map((innsending) => {
          return (
            <EkstraDokumentasjonsbehovBoks
              key={innsending.id}
              innsending={innsending}
              oppdaterInnsending={oppdaterInnsending}
              slettEkstraInnsending={slettInnsending}
              innsendingerUtenVedlegg={ekstraInnsendingerUtenVedlegg}
              settOverordnetAlertStripeMelding={settAlertStripeMelding}
            />
          );
        })}
      <>
        <div>
          <LeggTilInnsending
            leggTilNyDokumentasjonsbehovBoks={leggTilNyDokumentasjonsbehovBoks}
          >
            Legg til flere dokumenter
          </LeggTilInnsending>
        </div>
        <StyledDiv>
          <HovedKnapp onClick={visOppsummering}>Neste</HovedKnapp>
        </StyledDiv>
      </>
    </>
  );
};
