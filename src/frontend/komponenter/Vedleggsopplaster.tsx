import React, { useState } from 'react';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import Modal from 'nav-frontend-modal';
import {
  IDokumentasjonsbehov,
  IVedleggForEttersending,
} from '../typer/ettersending';
import VedleggsopplasterModal from './VedleggsopplasterModal';
import { Knapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import { StønadType } from '../typer/stønad';
import AlertStripe, { alertMelding } from './AlertStripe';

const Filopplaster = styled.div<{ visSkillelinje: boolean }>`
    text-align: center;
    border-bottom: ${(props) =>
      props.visSkillelinje ? '2px dashed #59514b' : ''};
    height: 64px;
  }
`;

const FilopplasterWrapper = styled.div`
  max-width: 775px;
  min-height: 68px;
`;

const AlertStripeMedPadding = styled(AlertStripe)`
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

interface IProps {
  oppdaterInnsending: (innsending: IDokumentasjonsbehov) => void;
  innsending: IDokumentasjonsbehov;
  maxFilstørrelse?: number;
  stønadType?: StønadType;
  beskrivelse: string;
}

const Vedleggsopplaster: React.FC<IProps> = ({
  innsending,
  oppdaterInnsending,
  maxFilstørrelse,
  stønadType,
  beskrivelse,
}: IProps) => {
  const [åpenModal, settÅpenModal] = useState<boolean>(false);

  const slettVedlegg = (vedlegg: IVedleggForEttersending): void => {
    oppdaterInnsending({
      ...innsending,
      vedlegg: [...innsending.vedlegg].filter(
        (v: IVedleggForEttersending) => v.id !== vedlegg.id
      ),
    });
  };

  const visVedleggTilOpplasting = (): IVedleggForEttersending[] => {
    return innsending.vedlegg;
  };

  return (
    <>
      <Modal
        isOpen={åpenModal}
        onRequestClose={() => settÅpenModal(false)}
        closeButton={true}
        contentLabel="Modal"
      >
        <VedleggsopplasterModal
          oppdaterInnsending={oppdaterInnsending}
          innsending={innsending}
          lukkModal={() => settÅpenModal(false)}
          maxFilstørrelse={maxFilstørrelse}
          stønadType={stønadType}
          beskrivelse={beskrivelse}
        />
      </Modal>
      <FilopplasterWrapper>
        {innsending.vedlegg.length === 0 && (
          <Filopplaster visSkillelinje={innsending.vedlegg.length > 0}>
            <Knapp onClick={() => settÅpenModal(true)}>Last opp fil(er)</Knapp>
          </Filopplaster>
        )}
        {innsending.vedlegg.length >= 1 && !innsending.erSammenslått && (
          <AlertStripeMedPadding
            melding={
              innsending.vedlegg.length === 1
                ? alertMelding.LASTET_OPP_EN
                : alertMelding.LASTET_OPP_FLERE
            }
          />
        )}
        {innsending.vedlegg.length >= 1 && innsending.erSammenslått && (
          <AlertStripeMedPadding melding={alertMelding.FILER_SAMMENSLÅTT} />
        )}
        <OpplastedeVedlegg
          vedleggsliste={visVedleggTilOpplasting()}
          slettVedlegg={slettVedlegg}
        />
      </FilopplasterWrapper>
    </>
  );
};

export default Vedleggsopplaster;
