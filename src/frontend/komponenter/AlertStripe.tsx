import {
  AlertStripeFeil,
  AlertStripeSuksess,
  AlertStripeInfo,
} from 'nav-frontend-alertstriper';
import React from 'react';

export enum alertMelding {
  SENDT_INN = 'Ettersendingen er sendt inn',
  FEIL = 'Noe gikk galt, prøv igjen',
  MANGLER_VEDLEGG = 'Minst én fil må lastes opp',
  MANGLER_STØNDASTYPE = 'Stønadstype må velges',
  MANGLER_DOKUMENTTYPE = 'Dokumenttype må velges',
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

  if (melding === alertMelding.MANGLER_STØNDASTYPE) {
    return (
      <AlertStripeInfo className={className}>
        {alertMelding.MANGLER_STØNDASTYPE}
      </AlertStripeInfo>
    );
  }

  if (melding === alertMelding.MANGLER_DOKUMENTTYPE) {
    return (
      <AlertStripeInfo className={className}>
        {alertMelding.MANGLER_DOKUMENTTYPE}
      </AlertStripeInfo>
    );
  }

  if (melding === alertMelding.MANGLER_VEDLEGG) {
    return (
      <AlertStripeInfo className={className}>
        {alertMelding.MANGLER_VEDLEGG}
      </AlertStripeInfo>
    );
  }

  return <></>;
};

export default AlertStripe;
