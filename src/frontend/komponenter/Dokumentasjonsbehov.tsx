import React, { useState } from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import { IDokumentasjonsbehov } from '../typer/dokumentasjonsbehov';
import { IHarSendtInnMedKrav } from '../typer/søknadsdata';
import '../stil/Vedleggsopplaster.less';
import '../stil/Dokumentasjonsbehov.less';
import { Checkbox } from 'nav-frontend-skjema';
import { useApp } from '../context/AppContext';

interface Props {
  dokumentasjonsbehov: IDokumentasjonsbehov;
}

const Dokumentasjonsbehov: React.FC<Props> = (props: Props) => {
  const { dokumentasjonsbehov } = props;
  const dokumentasjonSendt = (): boolean => {
    return (
      dokumentasjonsbehov.harSendtInn ||
      dokumentasjonsbehov.opplastedeVedlegg.length > 0
    );
  };
  const [checked, settCheckboxverdi] = useState<boolean>(false); //må endres til å hente verdi fra dokumentajsonsbehov

  const context = useApp();

  const oppdaterHarSendtInnMedKrav = () => {
    const invertedChecked = !checked;
    settCheckboxverdi(invertedChecked);
    const harSendtInnMedKrav: IHarSendtInnMedKrav = {
      harSendtInn: invertedChecked,
      kravId: dokumentasjonsbehov.id,
    };
    context.oppdaterHarSendtInnMedKrav(harSendtInnMedKrav);
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
        onChange={() => oppdaterHarSendtInnMedKrav()}
        checked={checked}
        label={'Jeg har levert på annen måte'}
      />
    </Ekspanderbartpanel>
  );
};

export default Dokumentasjonsbehov;
