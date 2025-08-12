import React from 'react';
import { DokumentasjonsbehovListe } from './DokumentasjonsbehovListe';
import { EkstraDokumentasjonsbehovBoks } from './EkstraDokumentasjonsbehovBoks';
import { IDokumentasjonsbehov, IEttersending } from '../typer/ettersending';
import styled from 'styled-components';
import KnappMedPadding from '../felles/Knapp';
import { alertMelding } from './AlertStripe';
import { AddCircle } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';

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

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const HovedKnapp = styled(KnappMedPadding)`
  margin: 1rem;
  margin-bottom: 0;
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
            <DokumentasjonsbehovListe
              key={'Dokumentasjonsbehov' + innsending.id}
              innsending={innsending}
              oppdaterInnsending={oppdaterInnsending}
              settAlertStripeMelding={settAlertStripeMelding}
            />
          );
        })}
      {ettersending.dokumentasjonsbehov
        .filter((innsending) => ekstraInnsendingerId.includes(innsending.id))
        .map((innsending) => {
          return (
            <EkstraDokumentasjonsbehovBoks
              key={'Ekstra dokumentasjonsbehov' + innsending.id}
              innsending={innsending}
              oppdaterInnsending={oppdaterInnsending}
              slettEkstraInnsending={slettInnsending}
              innsendingerUtenVedlegg={ekstraInnsendingerUtenVedlegg}
              settOverordnetAlertStripeMelding={settAlertStripeMelding}
            />
          );
        })}
      <Button
        variant={'tertiary'}
        type={'button'}
        icon={<AddCircle title={'Legg til dokumenter'} />}
        onClick={leggTilNyDokumentasjonsbehovBoks}
      >
        Legg til flere dokumenter
      </Button>
      <StyledDiv>
        <HovedKnapp onClick={visOppsummering}>Neste</HovedKnapp>
      </StyledDiv>
    </>
  );
};
