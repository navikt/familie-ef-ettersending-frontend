import { FileUpload, VStack } from '@navikt/ds-react';
import type React from 'react';
import { useState } from 'react';
import { hentOpplastetVedlegg } from '../api-service';
import type { IVedleggForEttersending } from '../typer/ettersending';
import { RessursStatus } from '../typer/ressurs';
import { base64toBlob, åpnePdfIEgenTab } from '../utils/filer';
import AlertStripe, { alertMelding } from './AlertStripe';

interface IOpplastedeVedlegg {
    vedleggsliste: IVedleggForEttersending[];
    slettVedlegg: (vedlegg: IVedleggForEttersending) => void;
}

export const OpplastedeVedlegg: React.FC<IOpplastedeVedlegg> = ({
    vedleggsliste,
    slettVedlegg,
}: IOpplastedeVedlegg) => {
    const [feilmelding, settFeilmelding] = useState<alertMelding>(alertMelding.TOM);

    const visDokumentNyFane = async (vedlegg: IVedleggForEttersending) => {
        settFeilmelding(alertMelding.TOM);
        try {
            const opplastetVedlegg = await hentOpplastetVedlegg(vedlegg.id);
            if (opplastetVedlegg.status === RessursStatus.SUKSESS) {
                åpnePdfIEgenTab(base64toBlob(opplastetVedlegg.data, 'application/pdf'), vedlegg.navn);
            }
        } catch {
            settFeilmelding(alertMelding.FEIL_NEDLASTING_DOKUMENT);
        }
    };

    return (
        <>
            <VStack as="ul" gap="space-12">
                {vedleggsliste.map((fil: IVedleggForEttersending) => (
                    <FileUpload.Item
                        as="li"
                        key={fil.id}
                        file={{
                            name: fil.navn.replace(/_/g, '-'),
                            size: fil.størrelse ?? 0,
                        }}
                        onFileClick={() => visDokumentNyFane(fil)}
                        href="#"
                        button={{
                            action: 'delete',
                            onClick: () => slettVedlegg(fil),
                        }}
                    />
                ))}
            </VStack>

            {feilmelding && <AlertStripe melding={feilmelding} />}
        </>
    );
};
