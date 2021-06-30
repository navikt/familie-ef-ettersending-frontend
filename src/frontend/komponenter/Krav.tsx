import React from 'react';
import Filopplasting from './Filopplasting';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

interface IProps {
  krav: IKrav;
}

interface IKrav {
  label: string;
}

const Krav: React.FC<IProps> = ({ krav }: IProps) => {
  return (
    <Ekspanderbartpanel tittel={krav.label}>
      <Filopplasting />
    </Ekspanderbartpanel>
  );
};

export default Krav;
