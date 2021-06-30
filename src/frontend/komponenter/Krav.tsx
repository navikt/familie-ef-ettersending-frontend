import React from 'react';
import Filopplasting from './Filopplasting';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

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
        <Ekspanderbartpanel tittel={krav.label}>
          <Filopplasting />
        </Ekspanderbartpanel>
      ) : (
        <Ekspanderbartpanel tittel={<i>krav.label</i>}>
          <Filopplasting />
        </Ekspanderbartpanel>
      )}
    </>
  );
};

export default Krav;
