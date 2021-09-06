import React, { useEffect, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { useApp } from '../context/AppContext';
import { IInnsendingX } from '../typer/ettersending';
import { DokumentasjonsbehovBoks } from './DokumentasjonsbehovBoks';

interface IProps {
  oppdaterInnsendingx: (innsending: IInnsendingX) => void;
  innsendingx: IInnsendingX;
}

export const DokumentasjonsbehovListe: React.FC<IProps> = ({
  innsendingx,
  oppdaterInnsendingx,
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
          key={innsendingx.id}
          innsendingx={innsendingx}
          oppdaterInnsendingx={oppdaterInnsendingx}
        />
      </>
    </>
  );
};
