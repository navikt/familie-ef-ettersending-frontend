import React from 'react';
import styled from 'styled-components/macro';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { IDokumentasjonsbehov } from '../typer/ettersending';
import { stønadTypeTilTekst } from '../typer/stønad';
import OpplastedeVedleggOversikt from './OpplastedeVedleggOversikt';
import { formaterIsoDato } from '../../shared-utils/dato';

const StyledDiv = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

interface IProps {
  innsendinger: IDokumentasjonsbehov[];
  tittel: string;
}

export const Oppsummering: React.FC<IProps> = ({
  innsendinger,
  tittel,
}: IProps) => {
  return (
    <div>
      <Undertittel>{tittel}</Undertittel>
      {innsendinger.map((innsending, index) => {
        return (
          <StyledDiv key={index}>
            <Normaltekst>
              <strong>Stønadstype: </strong>
              {innsending.stønadType &&
                stønadTypeTilTekst[innsending.stønadType]}
            </Normaltekst>
            <Normaltekst>
              <strong>Dokumenttype: </strong>
              {innsending.beskrivelse}
            </Normaltekst>
            <Normaltekst>
              <strong>Dato for innsending: </strong>
              {formaterIsoDato(innsending.innsendingstidspunkt)}
            </Normaltekst>
            <Normaltekst>
              <strong>Dokumenter: </strong>
              {innsending.vedlegg.length > 0 ? (
                <OpplastedeVedleggOversikt vedleggsliste={innsending.vedlegg} />
              ) : (
                'Du har opplyst om at du har levert dokumentasjon på en annen måte.'
              )}
            </Normaltekst>
          </StyledDiv>
        );
      })}
    </div>
  );
};
