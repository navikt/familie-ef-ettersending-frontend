import { Loader, VStack } from '@navikt/ds-react';
import type React from 'react';
import { useApp } from '../hooks/useApp';
import type { IDokumentasjonsbehov } from '../typer/ettersending';
import type { alertMelding } from './AlertStripe';
import { DokumentasjonsbehovBoks } from './DokumentasjonsbehovBoks';

interface IProps {
    oppdaterInnsending: (innsending: IDokumentasjonsbehov) => void;
    innsending: IDokumentasjonsbehov;
    settAlertStripeMelding: (melding: alertMelding) => void;
}

export const DokumentasjonsbehovListe: React.FC<IProps> = ({
    innsending,
    oppdaterInnsending,
    settAlertStripeMelding,
}: IProps) => {
    const context = useApp();
    const laster = !context.søker;

    if (laster) {
        return (
            <VStack align={'center'}>
                <Loader size={'xlarge'} title={'Venter på at dokumentasjonsbehov hentes'} />
            </VStack>
        );
    }

    return (
        <DokumentasjonsbehovBoks
            key={innsending.id}
            innsending={innsending}
            oppdaterInnsending={oppdaterInnsending}
            settAlertStripeMelding={settAlertStripeMelding}
        />
    );
};
