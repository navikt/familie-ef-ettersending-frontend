import React from 'react';
import Filopplaster from './Filopplaster';
import OpplastedeFiler from './OpplastedeFiler';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import { IKravliste } from '../typer/krav';
import '../stil/Filopplaster.less';
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
        <div className="opplastede-filer">
          <p>Tidligere opplastede filer:</p>
          <OpplastedeFiler
            filliste={krav.opplastedeVedlegg}
            kanSlettes={false}
          />
        </div>
      )}
      <Filopplaster />
    </Ekspanderbartpanel>
  );
};

export default Krav;
