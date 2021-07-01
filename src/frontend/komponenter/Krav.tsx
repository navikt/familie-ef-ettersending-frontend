import React, { useState } from 'react';
import Filopplasting from './Filopplasting';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import { useApp } from '../context/AppContext';

interface IKravliste {
  krav: IKrav;
}

interface IKrav {
  label: string;
  harSendtInn: boolean;
  opplastedeVedlegg: Array<any>;
  id: number;
}

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
          <Filopplasting id={krav.id}></Filopplasting>
        </Ekspanderbartpanel>
      ) : (
        <Ekspanderbartpanel
          tittel={
            <Alertstripe type="feil" form="inline">
              {krav.label}
            </Alertstripe>
          }
        >
          <Filopplasting id={krav.id}></Filopplasting>
        </Ekspanderbartpanel>
      )}
    </>
  );
};

export default Krav;
