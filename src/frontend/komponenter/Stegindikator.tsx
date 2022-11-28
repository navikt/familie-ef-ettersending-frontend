import React from 'react';
import styled from 'styled-components';

const StegListe = styled.ol`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
`;

const Steg = styled.li`
  position: relative;
  margin-right: 1.25rem;

  &::after {
    height: 1px;
    content: '';
    display: block;
    background-color: rgba(100, 100, 100, 1);
    position: absolute;
    top: 1rem;
    width: 9.25rem;
    left: 6rem;
    right: auto;

    @media (max-width: 650px) {
      width: 7rem;
      left: 3rem;
    }
  }

  &:last-child {
    margin-right: 0;

    &::after {
      display: none;
    }
  }

  min-width: 10rem;
  max-width: 10rem;
  @media (max-width: 650px) {
    min-width: 6rem;
    max-width: 6rem;
  }
`;

const StegInner = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  color: rgba(38, 38, 38, 1);
  position: relative;
  z-index: 1;
`;

const StegNummer = styled.div<{ ferdig: boolean; aktiv: boolean }>`
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.56) inset;
  background: white;

  ${(props) =>
    props.ferdig &&
    `
    background: rgba(241, 241, 241, 1);`}

  ${(props) =>
    props.aktiv &&
    `
    background: rgba(0, 91, 130, 1);
    color: rgba(255, 255, 255, 1);
    box-shadow: none;
    transform: scale(1.2);`}
`;

const StegLabel = styled.div<{ aktiv?: boolean }>`
  margin-top: 0.5rem;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 10rem;

  ${(props) =>
    props.aktiv &&
    `
    font-weight: bold;
    padding-bottom: 0.3rem;`}
`;

export interface ISteg {
  label: string;
  index: number;
}

interface IStegIndikatorProps {
  stegListe: ISteg[];
  aktivtSteg: number;
}

const Stegindikator: React.FC<IStegIndikatorProps> = ({
  stegListe,
  aktivtSteg,
}) => {
  return (
    <StegListe>
      {stegListe.map((steg) => {
        const aktivt = steg.index === aktivtSteg;
        const ferdig = steg.index < aktivtSteg;

        return (
          <Steg key={steg.label}>
            <StegInner>
              <StegNummer aktiv={aktivt} ferdig={ferdig}>
                {steg.index + 1}
              </StegNummer>
              <StegLabel aktiv={aktivt}>{steg.label}</StegLabel>
            </StegInner>
          </Steg>
        );
      })}
    </StegListe>
  );
};

export default Stegindikator;
