import React, { useState } from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import { IDokumentasjonsbehov } from '../typer/dokumentasjonsbehov';
import '../stil/Vedleggsopplaster.less';
import '../stil/Dokumentasjonsbehov.less';
import { Checkbox } from 'nav-frontend-skjema';

interface Props {
  dokumentasjonsbehov: IDokumentasjonsbehov;
  dokumentasjonsbehovTilInnsending: IDokumentasjonsbehov[];
  settDokumentasjonsbehovTilInnsending: (
    dokumentasjonsbehov: IDokumentasjonsbehov[]
  ) => void;
}

const Dokumentasjonsbehov: React.FC<Props> = ({
  dokumentasjonsbehov,
  settDokumentasjonsbehovTilInnsending,
  dokumentasjonsbehovTilInnsending,
}: Props) => {
  const [checked, settCheckboxverdi] = useState<boolean>(
    dokumentasjonsbehov.harSendtInn
  );

  const erDokumentasjonSendt = (): boolean => {
    return (
      dokumentasjonsbehov.harSendtInn ||
      dokumentasjonsbehov.opplastedeVedlegg.length > 0
    );
  };

  const oppdaterHarSendtInn = () => {
    const invertedChecked = !checked;
    settCheckboxverdi(invertedChecked);
    const oppdatertDokumentasjonsbehov = dokumentasjonsbehovTilInnsending.map(
      (behov) => {
        if (behov.id == dokumentasjonsbehov.id) {
          return {
            ...behov,
            harSendtInn: invertedChecked,
          };
        } else {
          return behov;
        }
      }
    );
    settDokumentasjonsbehovTilInnsending(oppdatertDokumentasjonsbehov);
  };

  return (
    <Ekspanderbartpanel
      tittel={
        <Alertstripe
          type={erDokumentasjonSendt() ? 'suksess' : 'advarsel'}
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
      <Vedleggsopplaster
        dokumentasjonsbehovId={dokumentasjonsbehov.id}
        dokumentasjonsbehovTilInnsending={dokumentasjonsbehovTilInnsending}
        settDokumentasjonsbehovTilInnsending={
          settDokumentasjonsbehovTilInnsending
        }
      />
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
