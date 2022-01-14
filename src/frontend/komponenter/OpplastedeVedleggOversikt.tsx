import React from 'react';
import vedlegg from '../icons/vedlegg.svg';
import { IVedleggForEttersending } from '../typer/ettersending';
import styled from 'styled-components/macro';

interface IOpplastedeVedlegg {
  vedleggsliste: IVedleggForEttersending[];
}

const StyledSpan = styled.span`
  text-decoration: underline;
`;

const StyledImg = styled.img`
  position: relative;
  top: -2px;
  margin-left: 0.3rem;
`;

const OpplastedeVedleggOversikt: React.FC<IOpplastedeVedlegg> = ({
  vedleggsliste,
}: IOpplastedeVedlegg) => {
  return (
    <>
      {vedleggsliste.map((fil: IVedleggForEttersending, index) => {
        return (
          <StyledSpan key={index}>
            <StyledImg src={vedlegg} alt="Vedleggsikon" />
            {' ' + fil.navn + ' '}
          </StyledSpan>
        );
      })}
    </>
  );
};

export default OpplastedeVedleggOversikt;
