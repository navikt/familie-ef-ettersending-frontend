import React from 'react';
import { DokumentasjonsbehovListe } from './DokumentasjonsbehovListe';
import { EkstraDokumentasjonsbehovBoks } from './EkstraDokumentasjonsbehovBoks';
import { IDokumentasjonsbehov, IEttersending } from '../typer/ettersending';
import { alertMelding } from './AlertStripe';
import { AddCircle } from '@navikt/ds-icons';
import { Button, VStack } from '@navikt/ds-react';

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
      <VStack align={'center'}>
        <Button onClick={visOppsummering}>Neste</Button>
      </VStack>
    </>
  );
};
