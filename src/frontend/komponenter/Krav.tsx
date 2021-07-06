import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Vedleggsopplaster from './Vedleggsopplaster';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import { IKravliste } from '../typer/krav';
import '../stil/Vedleggsopplaster.less';
import '../stil/Dokumentasjonsbehov.less';

const Krav: React.FC<IKravliste> = ({ krav }: IKravliste) => {
  const dokumentasjonSendt = (): boolean => {
    return krav.harSendtInn || krav.opplastedeVedlegg.length > 0;
  };

  return (
    <Ekspanderbartpanel
      tittel={
        <Alertstripe
          type={dokumentasjonSendt() ? 'suksess' : 'feil'}
          form="inline"
        >
          {krav.label}
        </Alertstripe>
      }
    >
      {krav.opplastedeVedlegg.length > 0 && (
        <div className="opplastede-vedlegg">
          <p>Tidligere opplastede vedlegg:</p>
          <OpplastedeVedlegg
            vedleggsliste={krav.opplastedeVedlegg}
            kanSlettes={false}
          />
        </div>
      )}
      <Vedleggsopplaster kravId={krav.id} />
    </Ekspanderbartpanel>
  );
};

export default Krav;
