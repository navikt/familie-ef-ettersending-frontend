import { AlertStripeFeil, AlertStripeSuksess } from 'nav-frontend-alertstriper';
import React from 'react';
import styled from 'styled-components';

export enum alertMelding {
  sendtInn = 'Ettersending er sendt inn',
  feil = 'Noe gikk galt, prøv igjen',
  tom = '',
}

interface IProps {
  melding: alertMelding;
  className?: string;
}

const AlertStripe: React.FC<IProps> = ({ className, melding }: IProps) => {
  if (melding === alertMelding.feil) {
    return (
      <AlertStripeFeil className={className}>
        {alertMelding.feil}
      </AlertStripeFeil>
    );
  }

  if (melding === alertMelding.sendtInn) {
    return (
      <AlertStripeSuksess className={className}>
        {alertMelding.sendtInn}
      </AlertStripeSuksess>
    );
  }

  return <></>;
};

export default AlertStripe;
