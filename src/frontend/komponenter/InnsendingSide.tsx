import React from 'react';
import { DokumentasjonsbehovListe } from './DokumentasjonsbehovListe';
import { EkstraDokumentasjonsbehovBoks } from './EkstraDokumentasjonsbehovBoks';
import { LeggTilInnsending } from './LeggTilInnsending';
import { IDokumentasjonsbehov, IEttersending } from '../typer/ettersending';
import styled from 'styled-components';
import { logSidevisning } from '../utils/amplitude';
import KnappMedPadding from '../nav-komponenter/Knapp';

interface IProps {
  ettersending: IEttersending;
  oppdaterInnsending: (innsending: IDokumentasjonsbehov) => void;
  slettInnsending: (id: string) => void;
  leggTilNyDokumentasjonsbehovBoks: () => void;
  ekstraInnsendingerId: string[];
  visOppsummering: () => void;
  ekstraInnsendingerUtenVedlegg: string[];
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
}: IProps) => {
  logSidevisning('Forside');

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
