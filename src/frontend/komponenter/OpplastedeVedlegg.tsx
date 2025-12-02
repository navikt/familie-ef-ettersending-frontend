import React, { useState } from 'react';
import { IVedleggForEttersending } from '../typer/ettersending';
import { base64toBlob, åpnePdfIEgenTab } from '../utils/filer';
import { hentOpplastetVedlegg } from '../api-service';
import { RessursStatus } from '../typer/ressurs';
import AlertStripe, { alertMelding } from './AlertStripe';
import { BodyShort, Button, HStack, Link, VStack } from '@navikt/ds-react';
import { UploadIcon } from '@navikt/aksel-icons';

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
      {vedleggsliste.map((fil: IVedleggForEttersending) => {
        return (
          <div key={fil.id}>
            <VStack gap={'2'}>
              <HStack gap={'2'} align={'center'}>
                <UploadIcon title="Binders" fontSize="1.5rem" />
                <BodyShort>
                  <b>Navn:</b>{' '}
                </BodyShort>
                <Link href="#" onClick={() => visDokumentNyFane(fil)}>
                  {fil.navn.replace(/_/g, '-')}
                </Link>
              </HStack>

              <div>
                <Button
                  type={'button'}
                  variant={'tertiary'}
                  icon={<UploadIcon title="slett" fontSize="1.5rem" />}
                  onClick={() => {
                    slettVedlegg(fil);
                  }}
                  size={'small'}
                >
                  Angre opplasting
                </Button>
              </div>
            </VStack>
          </div>
        );
      })}

      {feilmelding && <AlertStripe melding={feilmelding} />}
    </>
  );
};
