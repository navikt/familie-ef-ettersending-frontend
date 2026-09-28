import { BodyLong, GlobalAlert } from '@navikt/ds-react';
import { useToggles } from '../context/TogglesContext';
import { ToggleName } from '../typer/toggles';

export const VedlikeholdsvarselAlert = () => {
  const { erTogglePå } = useToggles();

  if (!erTogglePå(ToggleName.vedlikeholdsvarsel)) {
    return null;
  }

  return (
    <GlobalAlert status="announcement" style={{ marginBottom: '2rem' }}>
      <GlobalAlert.Header>
        <GlobalAlert.Title as="h2">
          Informasjon om planlagt vedlikehold
        </GlobalAlert.Title>
      </GlobalAlert.Header>
      <GlobalAlert.Content>
        <BodyLong spacing>
          Den 30. september 2026 fra kl. 15.30 til kl. 21.00 vil ettersending
          av dokumentasjon være utilgjengelig på grunn av planlagt vedlikehold.
        </BodyLong>
        <BodyLong spacing>
          Hvis du skal sende inn dokumentasjon i denne perioden, anbefaler vi at
          du gjør det før nedetiden starter.
        </BodyLong>
        <BodyLong>Vi beklager ulempene dette medfører.</BodyLong>
      </GlobalAlert.Content>
    </GlobalAlert>
  );
};
