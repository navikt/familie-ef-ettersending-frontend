import {
  AlertStripeFeil,
  AlertStripeSuksess,
  AlertStripeInfo,
} from 'nav-frontend-alertstriper';
import React from 'react';

export enum alertMelding {
  SENDT_INN = 'Takk. Dokumentasjon er sendt inn.',
  FEIL = 'Noe gikk galt, prøv igjen',
  MANGLER_VEDLEGG = 'Minst én fil må lastes opp',
  MANGLER_STØNDASTYPE = 'Stønadstype må velges',
  MANGLER_DOKUMENTTYPE = 'Dokumenttype må velges',
  MANGLER_BEGGE_TYPER = 'Både stønadstype og dokumenttype må velges',
  MANGLER_DOKUMENTASJON_I_EKSTRA_BOKS = 'Den nederste boksen mangler dokumentasjon',
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
      <AlertStripeFeil className={className}>
        {alertMelding.MANGLER_VEDLEGG}
      </AlertStripeFeil>
    );
  }

  if (melding === alertMelding.MANGLER_BEGGE_TYPER) {
    return (
      <AlertStripeFeil className={className}>
        {alertMelding.MANGLER_BEGGE_TYPER}
      </AlertStripeFeil>
    );
  }

  if (melding === alertMelding.MANGLER_DOKUMENTASJON_I_EKSTRA_BOKS) {
    return (
      <AlertStripeFeil className={className}>
        {alertMelding.MANGLER_DOKUMENTASJON_I_EKSTRA_BOKS}
      </AlertStripeFeil>
    );
  }

  return <></>;
};

export default AlertStripe;
