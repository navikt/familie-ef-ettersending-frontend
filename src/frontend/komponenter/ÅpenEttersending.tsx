import React from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import '../stil/Vedleggsopplaster.less';
import '../stil/Dokumentasjonsbehov.less';

const ÅpenEttersending = () => {
  return (
    <Ekspanderbartpanel
      tittel={
        <Alertstripe type="info" form="inline">
          Åpen innsending
        </Alertstripe>
      }
    >
      {/* TODO: må få denne til å fungere */}
      {/* <Vedleggsopplaster /> */}
    </Ekspanderbartpanel>
  );
};

export default ÅpenEttersending;
