import React from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import { IDokumentasjonsbehov } from '../typer/dokumentasjonsbehov';
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
      <Vedleggsopplaster dokumentasjonsbehovId="ÅPEN_INNSENDING" />
    </Ekspanderbartpanel>
  );
};

export default ÅpenInnsending;
