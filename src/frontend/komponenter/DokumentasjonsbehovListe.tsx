import React, { useEffect, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { useApp } from '../context/AppContext';
import { IDokumentasjonsbehov } from '../typer/ettersending';
import { DokumentasjonsbehovBoks } from './DokumentasjonsbehovBoks';
import { alertMelding } from './AlertStripe';

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
    return <NavFrontendSpinner />;
  }

  return (
    <>
      <>
        <DokumentasjonsbehovBoks
          key={innsending.id}
          innsending={innsending}
          oppdaterInnsending={oppdaterInnsending}
          settAlertStripeMelding={settAlertStripeMelding}
        />
      </>
    </>
  );
};
