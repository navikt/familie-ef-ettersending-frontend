import React from 'react';
import vedlegg from '../icons/vedlegg.svg';
import { IVedleggX } from '../typer/ettersending';
import '../stil/Opplastedevedlegg.less';
import styled from 'styled-components/macro';

interface IOpplastedeVedlegg {
  vedleggsliste: IVedleggX[];
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
      {vedleggsliste.map((fil: IVedleggX, index) => {
        return (
          <StyledSpan key={index}>
            <StyledImg
              className="vedleggsikon"
              src={vedlegg}
              alt="Vedleggsikon"
            />
            {' ' + fil.navn + ' '}
          </StyledSpan>
        );
      })}
    </>
  );
};

export default OpplastedeVedleggOversikt;
