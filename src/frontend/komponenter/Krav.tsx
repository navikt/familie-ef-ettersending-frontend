import React from 'react';
import Filopplasting from './Filopplasting';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import { IKravliste } from '../typer/krav';

const Krav: React.FC<IKravliste> = ({ krav }: IKravliste) => {
  const dokumentasjonSendt = (): boolean => {
    return krav.harSendtInn || krav.opplastedeVedlegg.length > 0;
  };

  return (
    <>
      {dokumentasjonSendt() ? (
        <Ekspanderbartpanel
          tittel={
            <Alertstripe type="suksess" form="inline">
              {krav.label}
            </Alertstripe>
          }
        >
          <Filopplasting />
        </Ekspanderbartpanel>
      ) : (
        <Ekspanderbartpanel
          tittel={
            <Alertstripe type="feil" form="inline">
              {krav.label}
            </Alertstripe>
          }
        >
          <Filopplasting />
        </Ekspanderbartpanel>
      )}
    </>
  );
};

export default Krav;
