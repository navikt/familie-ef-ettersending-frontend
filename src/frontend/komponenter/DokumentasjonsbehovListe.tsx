import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { IDokumentasjonsbehov } from '../typer/ettersending';
import { DokumentasjonsbehovBoks } from './DokumentasjonsbehovBoks';
import { alertMelding } from './AlertStripe';
import { Loader, VStack } from '@navikt/ds-react';

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
  const [laster, settLasterverdi] = useState(true);

  const context = useApp();

  useEffect(() => {
    settLasterverdi(false);
  }, [context.søker]);

  if (laster) {
    return (
      <VStack align={'center'}>
        <Loader
          size={'xlarge'}
          title={'Venter på at dokumentasjonsbehov hentes'}
        />
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
