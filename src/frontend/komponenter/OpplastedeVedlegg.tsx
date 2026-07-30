import React, { useState } from 'react';
import { IVedleggForEttersending } from '../typer/ettersending';
import { base64toBlob, åpnePdfIEgenTab } from '../utils/filer';
import { hentOpplastetVedlegg } from '../api-service';
import { RessursStatus } from '../typer/ressurs';
import AlertStripe, { alertMelding } from './AlertStripe';
import { FileUpload } from '@navikt/ds-react';

interface IOpplastedeVedlegg {
  vedleggsliste: IVedleggForEttersending[];
  slettVedlegg: (vedlegg: IVedleggForEttersending) => void;
}

export const OpplastedeVedlegg: React.FC<IOpplastedeVedlegg> = ({
  vedleggsliste,
  slettVedlegg,
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
      <ul>
        {vedleggsliste.map((fil: IVedleggForEttersending) => (
          <li key={fil.id}>
            <FileUpload.Item
              file={{
                name: fil.navn.replace(/_/g, '-'),
                size: 0,
              }}
              onFileClick={() => visDokumentNyFane(fil)}
              href="#"
              button={{
                action: 'delete',
                onClick: () => slettVedlegg(fil),
              }}
            />
          </li>
        ))}
      </ul>

      {feilmelding && <AlertStripe melding={feilmelding} />}
    </>
  );
};
