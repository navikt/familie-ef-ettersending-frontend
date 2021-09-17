import React, { useEffect, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { useApp } from '../context/AppContext';
import { IDokumentasjonsbehov } from '../typer/ettersending';
import { DokumentasjonsbehovBoks } from './DokumentasjonsbehovBoks';

interface IProps {
  oppdaterInnsending: (innsending: IDokumentasjonsbehov) => void;
  innsending: IDokumentasjonsbehov;
}

export const DokumentasjonsbehovListe: React.FC<IProps> = ({
  innsending,
  oppdaterInnsending,
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
        />
      </>
    </>
  );
};
