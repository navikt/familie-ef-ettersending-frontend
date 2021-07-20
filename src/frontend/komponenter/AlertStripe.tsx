import { AlertStripeFeil, AlertStripeSuksess } from 'nav-frontend-alertstriper';
import React from 'react';

export enum alertMelding {
  SENDT_INN = 'Ettersendingen er sendt inn',
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

  if (melding === alertMelding.SENDT_INN) {
    return (
      <AlertStripeSuksess className={className}>
        {alertMelding.SENDT_INN}
      </AlertStripeSuksess>
    );
  }

  return <></>;
};

export default AlertStripe;
