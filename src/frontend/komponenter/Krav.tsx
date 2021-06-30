import React from 'react';
import Filopplasting from './Filopplasting';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';

interface IProps {
  krav: IKrav;
}

interface IKrav {
  label: string;
  harSendtInn: boolean;
  opplastedeVedlegg: Array<any>;
}

const Krav: React.FC<IProps> = ({ krav }: IProps) => {
  const isTrue = (): boolean => {
    return krav.harSendtInn || krav.opplastedeVedlegg.length > 0;
  };

  return (
    <>
      {isTrue() ? (
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
