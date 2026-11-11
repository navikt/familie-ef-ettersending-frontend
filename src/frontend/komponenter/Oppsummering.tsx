import { BodyShort, Heading, Label, VStack } from '@navikt/ds-react';
import type React from 'react';
import { formaterIsoDato } from '../../shared-utils/dato';
import type { IDokumentasjonsbehov } from '../typer/ettersending';
import { stønadTypeTilTekst } from '../typer/stønad';
import VedleggListe from './VedleggListe';

interface IProps {
    innsendinger: IDokumentasjonsbehov[];
    tittel: string;
}

export const Oppsummering: React.FC<IProps> = ({ innsendinger, tittel }: IProps) => {
    return (
        <VStack gap={'space-4'}>
            <Heading level={'2'} size={'medium'}>
                {tittel}
            </Heading>

            {innsendinger.map(innsending => {
                return (
                    <div key={innsending.id}>
                        <BodyShort>
                            <Label as={'p'}>Stønadstype: </Label>
                            {innsending.stønadType && stønadTypeTilTekst[innsending.stønadType]}
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
