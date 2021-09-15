import React from 'react';
import { DokumentasjonsbehovListe } from './DokumentasjonsbehovListe';
import { EkstraDokumentasjonsbehovBoks } from './EkstraDokumentasjonsbehovBoks';
import { LeggTilInnsending } from './LeggTilInnsending';
import {
  IDokumentasjonsbehovTilBackend,
  IEttersending,
} from '../typer/ettersending';
import styled from 'styled-components';
import { Hovedknapp } from 'nav-frontend-knapper';

interface IProps {
  ettersending: IEttersending;
  oppdaterInnsending: (innsending: IDokumentasjonsbehovTilBackend) => void;
  slettInnsending: (id: string) => void;
  leggTilNyDokumentasjonsbehovBoks: () => void;
  ekstraInnsendingerId: string[];
  visOppsummering: () => void;
}

const SoknadContainer = styled.div`
  padding-bottom: 0rem;
`;

const StyledDiv = styled.div`
  display: flex;
`;

const StyledHovedknapp = styled(Hovedknapp)`
  margin: 1rem auto;
  display: flex;
`;

export const InnsendingSide: React.FC<IProps> = ({
  ettersending,
  oppdaterInnsending,
  slettInnsending,
  leggTilNyDokumentasjonsbehovBoks,
  ekstraInnsendingerId,
  visOppsummering,
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
          <StyledHovedknapp onClick={visOppsummering}>Neste</StyledHovedknapp>
        </StyledDiv>
      </>
    </>
  );
};
