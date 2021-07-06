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

interface IVedleggsopplaster {
  kravId: string;
}

const Vedleggsopplaster: React.FC<IVedleggsopplaster> = ({
  kravId,
}: IVedleggsopplaster) => {
  const [feilmeldinger, settFeilmeldinger] = useState<string[]>([]);
  const [åpenModal, settÅpenModal] = useState<boolean>(false);
  const [vedleggTilOpplasting, settVedleggTilOpplasting] = useState<IVedlegg[]>(
    []
  );

  useEffect(() => settVedleggTilOpplasting(filtrerVedleggPåKrav), []);

  const filtrerVedleggPåKrav = () => {
    const filtrerteVedlegg = [];
    context.vedleggMedKrav.forEach((element) => {
      if (element.kravId === kravId) {
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

  const onDrop = useCallback(
    (vedlegg) => {
      const feilmeldingsliste: string[] = [];
      const nyeVedlegg: IVedlegg[] = [];

      vedlegg.forEach((fil) => {
        if (!sjekkTillatFiltype(fil.type)) {
          feilmeldingsliste.push(fil.name + ' - Ugyldig filtype');
          settFeilmeldinger(feilmeldingsliste);
          settÅpenModal(true);
          return;
        }

        const vedlegg: IVedlegg = {
          dokumentId: fil.lastModified, //TODO denne blir generert av backend, forløbig random verdi
          navn: fil.name,
          størrelse: fil.size,
          tidspunkt: dagensDatoMedTidspunktStreng,
        };

        const vedleggMedKrav: IVedleggMedKrav = {
          vedlegg: vedlegg,
          kravId: kravId,
        };

        nyeVedlegg.push(vedlegg);
        context.leggTilVedleggMedKrav(vedleggMedKrav);
      });
      settVedleggTilOpplasting(nyeVedlegg.concat(vedleggTilOpplasting));
    },
    [vedleggTilOpplasting]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="vedleggsopplaster-wrapper">
      <div className="opplastede-vedlegg">
        <p>Nye vedlegg:</p>

        <OpplastedeVedlegg
          vedleggsliste={vedleggTilOpplasting}
          kanSlettes={true}
          slettVedlegg={slettVedlegg}
        />
      </div>

      <div className="vedleggsopplaster">
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
