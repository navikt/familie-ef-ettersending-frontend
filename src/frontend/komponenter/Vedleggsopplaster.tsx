import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Normaltekst } from 'nav-frontend-typografi';
import opplasting from '../icons/opplasting.svg';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import Modal from 'nav-frontend-modal';
import { IVedlegg } from '../typer/søknadsdata';
import '../stil/Vedleggsopplaster.less';
import { dagensDatoMedTidspunktStreng } from '../../shared-utils/dato';
import { useApp } from '../context/AppContext';
import { IVedleggMedKrav } from '../typer/søknadsdata';
import axios from 'axios';
import environment from '../../backend/environment';
import { sendVedleggTilMellomlager } from '../api-service';
import { response } from 'express';

interface IVedleggsopplaster {
  dokumentasjonsbehovId: string;
}

const Vedleggsopplaster: React.FC<IVedleggsopplaster> = ({
  dokumentasjonsbehovId,
}: IVedleggsopplaster) => {
  const [feilmeldinger, settFeilmeldinger] = useState<string[]>([]);
  const [åpenModal, settÅpenModal] = useState<boolean>(false);
  const [vedleggTilOpplasting, settVedleggTilOpplasting] = useState<IVedlegg[]>(
    []
  );

  useEffect(() => settVedleggTilOpplasting(filtrerVedleggPåKrav), []);

  const leggTilFilTilOpplasting = (vedlegg: IVedlegg) => {
    settVedleggTilOpplasting((nyListeMedVedlegg) => [
      ...nyListeMedVedlegg,
      vedlegg,
    ]);
  };

  const filtrerVedleggPåKrav = () => {
    const filtrerteVedlegg = [];
    context.vedleggMedKrav.forEach((element) => {
      if (element.kravId === dokumentasjonsbehovId) {
        filtrerteVedlegg.push(element.vedlegg);
      }
    });
    return filtrerteVedlegg;
  };

  const context = useApp();

  const sjekkTillatFiltype = (filtype: string) => {
    const tillateFilTyper = ['pdf', 'jpg', 'svg', 'png', 'jpeg', 'gif', 'ico'];
    let godkjentFiltype = false;
    tillateFilTyper.forEach((tillatFilType) => {
      if (filtype.includes(tillatFilType)) {
        godkjentFiltype = true;
      }
    });
    return godkjentFiltype;
  };

  const slettVedlegg = (vedlegg: IVedlegg) => {
    context.slettVedleggMedKrav(vedlegg.dokumentId);
    const oppdatertVedleggsliste = vedleggTilOpplasting.filter(
      (fil) => fil !== vedlegg
    );
    settVedleggTilOpplasting(oppdatertVedleggsliste);
  };

  const lastOppVedlegg = async (fil) => {
    const formData = new FormData();
    formData.append('file', fil);
    const respons = await sendVedleggTilMellomlager(formData);
    console.log(respons);
    const vedlegg: IVedlegg = {
      dokumentId: respons,
      navn: fil.name,
      størrelse: fil.size,
      tidspunkt: dagensDatoMedTidspunktStreng,
    };

    const vedleggMedKrav: IVedleggMedKrav = {
      vedlegg: vedlegg,
      kravId: dokumentasjonsbehovId,
    };
    context.leggTilVedleggMedKrav(vedleggMedKrav);
    leggTilFilTilOpplasting(vedlegg);
  };

  const onDrop = useCallback(
    (vedlegg) => {
      const feilmeldingsliste: string[] = [];

      vedlegg.forEach((fil) => {
        if (!sjekkTillatFiltype(fil.type)) {
          feilmeldingsliste.push(fil.name + ' - Ugyldig filtype');
          settFeilmeldinger(feilmeldingsliste);
          settÅpenModal(true);
          return;
        }

        lastOppVedlegg(fil);
      });
    },
    [vedleggTilOpplasting]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="filopplaster-wrapper">
      <div className="opplastede-filer">
        <p>Nye filer:</p>

        <OpplastedeVedlegg
          vedleggsliste={vedleggTilOpplasting}
          kanSlettes={true}
          slettVedlegg={slettVedlegg}
        />
      </div>

      <div className="filopplaster">
        <Modal
          isOpen={åpenModal}
          onRequestClose={() => settÅpenModal(false)}
          closeButton={true}
          contentLabel="Modal"
        >
          <div className="feilmelding">
            {feilmeldinger.map((feilmelding) => (
              <AlertStripeFeil key={feilmelding} className="feilmelding-alert">
                {feilmelding}
              </AlertStripeFeil>
            ))}
          </div>
        </Modal>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <img
            src={opplasting}
            className="opplastingsikon"
            alt="Opplastingsikon"
          />
          <Normaltekst className="tekst">
            {isDragActive ? 'Last opp dokumentasjon' : 'Slipp filen her..'}
          </Normaltekst>
        </div>
      </div>
    </div>
  );
};

export default Vedleggsopplaster;
