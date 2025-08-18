import { Stepper } from '@navikt/ds-react';
import React from 'react';

export interface ISteg {
  label: string;
  index: number;
}

interface IStegIndikatorProps {
  stegListe: ISteg[];
  aktivtSteg: number;
  settAktivtSteg: React.Dispatch<React.SetStateAction<number>>;
}

const Stegindikator: React.FC<IStegIndikatorProps> = ({
  stegListe,
  aktivtSteg,
  settAktivtSteg,
}) => {
  return (
    <Stepper
      aria-labelledby="stepper-heading"
      activeStep={aktivtSteg + 1} // State er 0-indeksert
      onStepChange={settAktivtSteg}
      orientation="horizontal"
      interactive={false}
      aria-hidden={true}
    >
      {stegListe.map((steg) => (
        <Stepper.Step href="#" key={steg.label}>
          {steg.label}
        </Stepper.Step>
      ))}
    </Stepper>
  );
};

export default Stegindikator;
