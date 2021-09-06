import React from 'react';
import styled from 'styled-components/macro';
import add from '../icons/add.svg';
import { IInnsendingX } from '../typer/ettersending';

const StyledKnapp = styled.button`
  margin: 0;
  padding: 0;
  background: none;
  border: none;
  text-decoration: underline;
  font-family: 'Source Sans Pro', Arial, sans-serif;
  font-size: 1rem;
  line-height: 1.375rem;
  font-weight: 400;
  color: #0067c5;

  cursor: pointer;

  &:hover {
    text-decoration: none;
  }

  & > span {
    padding-right: 5px;
  }

  svg {
    height: 16px;
    width: 16px;
  }

  &.kunEn {
    display: none;
  }

  &:hover {
    text-decoration: underline;
    border: none;
  }
`;
// TODO: Fiks styling (For stort plusstegn)

interface IProps {
  leggTilNyBoks: (innsending: IInnsendingX) => void;
  children: string;
}

export const LeggTilVedleggKnapp: React.FC<IProps> = ({
  leggTilNyBoks,
  children,
}: IProps) => {
  return (
    <StyledKnapp>
      <img src={add} />
      <span>{children}</span>
    </StyledKnapp>
  );
};
