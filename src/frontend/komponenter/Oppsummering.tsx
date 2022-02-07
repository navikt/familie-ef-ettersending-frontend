import React from 'react';
import styled from 'styled-components/macro';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { IDokumentasjonsbehov } from '../typer/ettersending';
import { stønadTypeTilTekst } from '../typer/stønad';
import OpplastedeVedleggOversikt from './OpplastedeVedleggOversikt';
import { formaterIsoDato } from '../../shared-utils/dato';
import { logSidevisning } from '../utils/amplitude';
import { EOppsummeringstitler } from '../utils/oppsummeringssteg';

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
  if (tittel === EOppsummeringstitler.Innsending) {
    logSidevisning('Oppsummering');
  } else if (tittel === EOppsummeringstitler.Kvittering) {
    logSidevisning('Kvittering');
  }

  return (
    <div>
      <Undertittel>{tittel}</Undertittel>
      {innsendinger.map((innsending, index) => {
        return (
          <StyledDiv key={index}>
            <Normaltekst>
              <b>Stønadstype: </b>
              {innsending.stønadType &&
                stønadTypeTilTekst[innsending.stønadType]}
            </Normaltekst>
            <Normaltekst>
              <b>Dokumenttype: </b>
              {innsending.beskrivelse}
            </Normaltekst>
            <Normaltekst>
              <b>Dato for innsending: </b>
              {formaterIsoDato(innsending.innsendingstidspunkt)}
            </Normaltekst>
            <Normaltekst>
              <b>Dokumenter: </b>
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
