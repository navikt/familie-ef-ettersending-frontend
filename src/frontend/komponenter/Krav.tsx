import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Vedleggsopplaster from './Vedleggsopplaster';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import { IDokumentasjonsbehovListe } from '../typer/dokumentasjonsbehov';
import '../stil/Vedleggsopplaster.less';
import '../stil/Dokumentasjonsbehov.less';

const Krav: React.FC<IDokumentasjonsbehovListe> = ({
  dokumentasjonsbehov,
}: IDokumentasjonsbehovListe) => {
  const dokumentasjonSendt = (): boolean => {
    return (
      dokumentasjonsbehov.harSendtInn ||
      dokumentasjonsbehov.opplastedeVedlegg.length > 0
    );
  };

  return (
    <Ekspanderbartpanel
      tittel={
        <Alertstripe
          type={dokumentasjonSendt() ? 'suksess' : 'feil'}
          form="inline"
        >
          {dokumentasjonsbehov.label}
        </Alertstripe>
      }
    >
      {dokumentasjonsbehov.opplastedeVedlegg.length > 0 && (
        <div className="opplastede-vedlegg">
          <p>Tidligere opplastede vedlegg:</p>
          <OpplastedeVedlegg
            vedleggsliste={dokumentasjonsbehov.opplastedeVedlegg}
            kanSlettes={false}
          />
        </div>
      )}
      <Vedleggsopplaster kravId={dokumentasjonsbehov.id} />
    </Ekspanderbartpanel>
  );
};

export default Krav;
