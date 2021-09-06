import React from 'react';
import styled from 'styled-components/macro';
import add from '../icons/add.svg';

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

const StyledImg = styled.img`
  position: relative;
  margin-right: 0.5rem;
`;

interface IProps {
  leggTilNyDokumentasjonsbehovBoks: () => void;
  children: string;
}

export const LeggTilInnsending: React.FC<IProps> = ({
  leggTilNyDokumentasjonsbehovBoks,
  children,
}: IProps) => {
  return (
    <StyledKnapp onClick={leggTilNyDokumentasjonsbehovBoks}>
      <StyledImg
        src={add}
        alt={'plusstegn'}
        style={{ height: 20, width: 20 }}
      />
      <span>{children}</span>
    </StyledKnapp>
  );
};
