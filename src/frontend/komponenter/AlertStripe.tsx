import { AlertStripeFeil, AlertStripeSuksess } from 'nav-frontend-alertstriper';
import React from 'react';

export enum alertMelding {
  SENDT_INN = 'Takk. Dokumentasjon er sendt inn.',
  FEIL = 'Noe gikk galt, prøv igjen',
  MANGLER_VEDLEGG = 'Du har ikke lastet opp vedlegg for dokumentasjonsbehov',
  MANGLER_BEGGE_TYPER = 'Både stønadstype og dokumenttype må velges',
  MANGLER_DOKUMENTASJON_I_EKSTRA_BOKS = 'Ingen vedlegg er lastet opp',
  FEIL_VED_INNSENDING = 'Noe gikk galt ved innsending av dine dokumenter.',
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

  if (melding === alertMelding.FEIL_VED_INNSENDING) {
    return (
      <AlertStripeFeil className={className}>
        {alertMelding.FEIL_VED_INNSENDING}
      </AlertStripeFeil>
    );
  }

  return <></>;
};

export default AlertStripe;
