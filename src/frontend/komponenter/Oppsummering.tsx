import React from 'react';
import { IDokumentasjonsbehov } from '../typer/ettersending';
import { stønadTypeTilTekst } from '../typer/stønad';
import VedleggListe from './VedleggListe';
import { formaterIsoDato } from '../../shared-utils/dato';
import { BodyShort, Heading, Label, VStack } from '@navikt/ds-react';

interface IProps {
  innsendinger: IDokumentasjonsbehov[];
  tittel: string;
}

export const Oppsummering: React.FC<IProps> = ({
  innsendinger,
  tittel,
}: IProps) => {
  return (
    <VStack gap={'2'}>
      <Heading level={'2'} size={'medium'}>
        {tittel}
      </Heading>

      {innsendinger.map((innsending, index) => {
        return (
          <div key={index}>
            <BodyShort>
              <Label as={'p'}>Stønadstype: </Label>
              {innsending.stønadType &&
                stønadTypeTilTekst[innsending.stønadType]}
            </BodyShort>

            <BodyShort>
              <Label as={'p'}>Dokumenttype: </Label>
              {innsending.beskrivelse}
            </BodyShort>

            <BodyShort>
              <Label as={'p'}>Dato for innsending: </Label>
              {formaterIsoDato(innsending.innsendingstidspunkt)}
            </BodyShort>

            {innsending.vedlegg.length > 0 ? (
              <VedleggListe vedleggsliste={innsending.vedlegg} />
            ) : (
              'Du har opplyst om at du har levert dokumentasjon på en annen måte.'
            )}
          </div>
        );
      })}
    </VStack>
  );
};
