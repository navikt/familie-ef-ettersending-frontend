import React, { useState } from 'react';
import { IVedleggForEttersending } from '../typer/ettersending';
import AlertStripe, { alertMelding } from './AlertStripe';
import { hentOpplastetVedlegg } from '../api-service';
import { RessursStatus } from '../typer/ressurs';
import { base64toBlob, åpnePdfIEgenTab } from '../utils/filer';
import { BodyShort, Link, VStack } from '@navikt/ds-react';

interface IOpplastedeVedlegg {
  vedleggsliste: IVedleggForEttersending[];
}

const VedleggListe: React.FC<IOpplastedeVedlegg> = ({
  vedleggsliste,
}: IOpplastedeVedlegg) => {
  const [feilmelding, settFeilmelding] = useState<alertMelding>(
    alertMelding.TOM,
  );

  const visDokumentNyFane = async (vedlegg: IVedleggForEttersending) => {
    settFeilmelding(alertMelding.TOM);
    try {
      const opplastetVedlegg = await hentOpplastetVedlegg(vedlegg.id);
      if (opplastetVedlegg.status === RessursStatus.SUKSESS) {
        åpnePdfIEgenTab(
          base64toBlob(opplastetVedlegg.data, 'application/pdf'),
          vedlegg.navn,
        );
      }
    } catch {
      settFeilmelding(alertMelding.FEIL_NEDLASTING_DOKUMENT);
    }
  };

  return (
    <>
      <BodyShort weight="semibold">Dokumenter:</BodyShort>

      {vedleggsliste.map((fil: IVedleggForEttersending) => {
        return (
          <div key={fil.id}>
            <VStack>
              <Link href="#" onClick={() => visDokumentNyFane(fil)}>
                {fil.navn.replace(/_/g, '-')}
              </Link>
            </VStack>
          </div>
        );
      })}

      {feilmelding && <AlertStripe melding={feilmelding} />}
    </>
  );
};

export default VedleggListe;
