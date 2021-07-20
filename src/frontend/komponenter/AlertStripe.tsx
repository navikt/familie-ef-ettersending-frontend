import { AlertStripeFeil, AlertStripeSuksess } from 'nav-frontend-alertstriper';
import React from 'react';
import styled from 'styled-components';

export enum alertMelding {
  SENDTINN = 'Ettersending er sendt inn',
  FEIL = 'Noe gikk galt, prøv igjen',
  TOM = '',
}

interface IProps {
  melding: alertMelding;
  className?: string;
}

const AlertStripe: React.FC<IProps> = ({ className, melding }: IProps) => {
  if (melding === alertMelding.FEIL) {
    return (
      <AlertStripeFeil className={className}>
        {alertMelding.FEIL}
      </AlertStripeFeil>
    );
  }

  if (melding === alertMelding.SENDTINN) {
    return (
      <AlertStripeSuksess className={className}>
        {alertMelding.SENDTINN}
      </AlertStripeSuksess>
    );
  }

  return <></>;
};

export default AlertStripe;
