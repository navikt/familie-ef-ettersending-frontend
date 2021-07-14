import React from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import '../stil/Vedleggsopplaster.less';
import '../stil/Dokumentasjonsbehov.less';

const ÅpenInnsending = () => {
  return (
    <Ekspanderbartpanel
      tittel={
        <Alertstripe type="info" form="inline">
          Åpen innsending
        </Alertstripe>
      }
    >
      <Vedleggsopplaster />
    </Ekspanderbartpanel>
  );
};

export default ÅpenInnsending;
