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
      activeStep={aktivtSteg + 1}
      onStepChange={settAktivtSteg}
      orientation="horizontal"
      interactive={false}
      aria-hidden={true}
    >
      {stegListe.map((steg) => (
        <Stepper.Step key={steg.label} href="#">
          {steg.label}
        </Stepper.Step>
      ))}
    </Stepper>
  );
};

export default Stegindikator;
