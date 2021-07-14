import React, { useState } from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import { IDokumentasjonsbehov } from '../typer/dokumentasjonsbehov';
import '../stil/Vedleggsopplaster.less';
import '../stil/Dokumentasjonsbehov.less';
import { Checkbox } from 'nav-frontend-skjema';
import { useApp } from '../context/AppContext';

interface Props {
  dokumentasjonsbehov: IDokumentasjonsbehov;
}

const Dokumentasjonsbehov: React.FC<Props> = (props: Props) => {
  const { dokumentasjonsbehov } = props;
  const [checked, settCheckboxverdi] = useState<boolean>(
    dokumentasjonsbehov.harSendtInn
  );
  const dokumentasjonSendt = (): boolean => {
    return (
      dokumentasjonsbehov.harSendtInn ||
      dokumentasjonsbehov.opplastedeVedlegg.length > 0
    );
  };

  const context = useApp();

  const oppdaterHarSendtInn = () => {
    const invertedChecked = !checked;
    settCheckboxverdi(invertedChecked);
    context.oppdaterHarSendtInn(invertedChecked, dokumentasjonsbehov.id);
  };

  return (
    <Ekspanderbartpanel
      tittel={
        <Alertstripe
          type={dokumentasjonSendt() ? 'suksess' : 'feil'}
          form="inline"
        >
          {dokumentasjonsbehov.label}
        </Alertstripe>
      }
    >
      {dokumentasjonsbehov.opplastedeVedlegg.length > 0 && (
        <div className="opplastede-filer">
          <p>Tidligere opplastede filer:</p>
          <OpplastedeVedlegg
            vedleggsliste={dokumentasjonsbehov.opplastedeVedlegg}
            kanSlettes={false}
          />
        </div>
      )}
      <Vedleggsopplaster dokumentasjonsbehovId={dokumentasjonsbehov.id} />
      <Checkbox
        className="leveranseCheckbox"
        onChange={() => oppdaterHarSendtInn()}
        checked={checked}
        label={'Jeg har levert på annen måte'}
      />
    </Ekspanderbartpanel>
  );
};

export default Dokumentasjonsbehov;
