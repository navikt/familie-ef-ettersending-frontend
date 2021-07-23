import React, { Dispatch, SetStateAction, useState } from 'react';
import Vedleggsopplaster from './Vedleggsopplaster';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Alertstripe from 'nav-frontend-alertstriper';
import { IDokumentasjonsbehov } from '../typer/dokumentasjonsbehov';
import '../stil/Vedleggsopplaster.less';
import { Checkbox } from 'nav-frontend-skjema';
import { EttersendingType } from '../typer/ettersending';
import styled from 'styled-components';

const StyledEkspanderbartpanel = styled(Ekspanderbartpanel)`
  margin: 1rem auto;
`;

const StyledCheckbox = styled(Checkbox)`
  margin: 1rem 0;
`;

interface Props {
  dokumentasjonsbehov: IDokumentasjonsbehov;
  dokumentasjonsbehovTilInnsending: IDokumentasjonsbehov[];
  settDokumentasjonsbehovTilInnsending: Dispatch<
    SetStateAction<IDokumentasjonsbehov[]>
  >;
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
    <StyledEkspanderbartpanel
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
          />
        </div>
      )}
      <Vedleggsopplaster
        ettersendingType={
          EttersendingType.ETTERSENDING_MED_SØKNAD_DOKUMENTASJONSBEHOV
        }
        dokumentasjonsbehovId={dokumentasjonsbehov.id}
        dokumentasjonsbehovTilInnsending={dokumentasjonsbehovTilInnsending}
        settDokumentasjonsbehovTilInnsending={
          settDokumentasjonsbehovTilInnsending
        }
      />
      <StyledCheckbox
        onChange={() => oppdaterHarSendtInn()}
        checked={checked}
        label={'Jeg har levert på annen måte'}
      />
    </StyledEkspanderbartpanel>
  );
};

export default Dokumentasjonsbehov;
