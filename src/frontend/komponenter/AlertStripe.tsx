import React from 'react';
import { Alert } from '@navikt/ds-react';

export enum alertMelding {
  SENDT_INN = 'Takk. Dokumentasjon er sendt inn.',
  LASTET_OPP_EN = 'Filen er nå klar til å sendes inn.',
  LASTET_OPP_FLERE = 'Filene er nå klare til å sendes inn.',
  FILER_SAMMENSLÅTT = 'Filene er sammenslått til et dokument som er klart til å sendes inn.',
  FEIL = 'Noe gikk galt, prøv igjen',
  FEIL_NEDLASTING_DOKUMENT = 'Noe gikk galt ved uthenting av opplastet dokument',
  FEIL_SAMMENSLÅING_DOKUMENT = 'Noe gikk galt ved sammenslåing av opplastede dokumenter',
  FEIL_FOR_LITEN_FIL = 'Dokumentet du prøver å laste opp er for lite og ikke lesbart',
  MANGLER_VEDLEGG = 'Du har ikke lastet opp vedlegg. Det kan du gjøre ved å trykke på knappen "Last opp fil(er)"',
  MANGLER_BEGGE_TYPER = 'Både stønadstype og dokumenttype må være valgt',
  MANGLER_DOKUMENTASJON_I_EKSTRA_BOKS = 'Ingen vedlegg er lastet opp',
  FEIL_VED_INNSENDING = 'Noe gikk galt ved innsending av dine dokumenter.',
  FEIL_FILTYPE_INNSENDING = 'En eller flere filer er av feil filtype. Tillate filtyper: pdf jpg png jpeg',
  FEIL_STØRRELSE_INNSENDING = 'En eller flere filer er for store (maksimal filstørrelse er 10MB)',
  TOM = '',
}

interface IProps {
  melding: alertMelding;
  className?: string;
}

const AlertStripe: React.FC<IProps> = ({ className, melding }: IProps) => {
  switch (melding) {
    case alertMelding.SENDT_INN:
    case alertMelding.LASTET_OPP_EN:
    case alertMelding.LASTET_OPP_FLERE:
    case alertMelding.FILER_SAMMENSLÅTT:
      return (
        <Alert variant={'success'} className={className}>
          {melding}
        </Alert>
      );
    case alertMelding.FEIL:
    case alertMelding.MANGLER_VEDLEGG:
    case alertMelding.MANGLER_BEGGE_TYPER:
    case alertMelding.MANGLER_DOKUMENTASJON_I_EKSTRA_BOKS:
    case alertMelding.FEIL_VED_INNSENDING:
    case alertMelding.FEIL_FOR_LITEN_FIL:
    case alertMelding.FEIL_SAMMENSLÅING_DOKUMENT:
    case alertMelding.FEIL_STØRRELSE_INNSENDING:
    case alertMelding.FEIL_FILTYPE_INNSENDING:
      return (
        <Alert variant={'error'} className={className}>
          {melding}
        </Alert>
      );
    case alertMelding.FEIL_NEDLASTING_DOKUMENT:
      return (
        <Alert variant={'warning'} className={className}>
          {melding}
        </Alert>
      );
  }

  return <></>;
};

export default AlertStripe;
