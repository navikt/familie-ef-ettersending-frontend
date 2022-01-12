import React, { useState } from 'react';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import Modal from 'nav-frontend-modal';
import {
  IDokumentasjonsbehov,
  IVedleggForEttersending,
} from '../typer/ettersending';
import '../stil/Vedleggsopplaster.less';
import VedleggsopplasterModal from './VedleggsopplasterModal';
import { Knapp } from 'nav-frontend-knapper';

interface IProps {
  oppdaterInnsending: (innsending: IDokumentasjonsbehov) => void;
  innsending: IDokumentasjonsbehov;
  maxFilstørrelse?: number;
}

const Vedleggsopplaster: React.FC<IProps> = ({
  innsending,
  oppdaterInnsending,
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
    <div className="filopplaster-wrapper">
      <div className="filopplaster">
        <Modal
          isOpen={åpenModal}
          onRequestClose={() => settÅpenModal(false)}
          closeButton={true}
          contentLabel="Modal"
        >
          <VedleggsopplasterModal
            oppdaterInnsending={oppdaterInnsending}
            innsending={innsending}
          />
        </Modal>
        <Knapp>Last opp fil(er)</Knapp>
      </div>
      <OpplastedeVedlegg
        vedleggsliste={visVedleggTilOpplasting()}
        slettVedlegg={slettVedlegg}
      />
    </div>
  );
};

export default Vedleggsopplaster;
