import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Normaltekst } from 'nav-frontend-typografi';
import opplasting from '../icons/opplasting.svg';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import OpplastedeFiler from './OpplastedeFiler';
import Modal from 'nav-frontend-modal';
import { IVedlegg } from '../typer/søknadsdata';
import '../stil/Filopplaster.less';
import { dagensDatoMedTidspunktStreng } from '../../shared-utils/dato';
import { useApp } from '../context/AppContext';
import { IVedleggMedKrav } from '../typer/søknadsdata';
import axios from 'axios';

interface IFilopplaster {
  kravId: string;
}

const Filopplaster: React.FC<IFilopplaster> = ({ kravId }: IFilopplaster) => {
  const [feilmeldinger, settFeilmeldinger] = useState<string[]>([]);
  const [åpenModal, settÅpenModal] = useState<boolean>(false);
  const [filerTilOpplasting, settFilerTilOpplasting] = useState<IVedlegg[]>([]);

  //const [nyeFilerX, settNyeFilerX] = useState<IVedlegg[]>([]);

  const [count, setCount] = useState(0);

  const leggTilNyeFiler = (fil) => {
    settNyeFilerX((nyFil) => [...nyFil, fil]);
  };

  useEffect(() => settFilerTilOpplasting(filtrerVedleggPåKrav), []);

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
    const oppdatertFilliste = filerTilOpplasting.filter(
      (fil) => fil !== vedlegg
    );
    settFilerTilOpplasting(oppdatertFilliste);
    console.log('sletter vedlegg med krav');
  };

  const lastOppVedlegg = async (fil) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', fil);
    const nyeFiler: IVedlegg[] = [];
    await axios
      .post(
        'http://localhost:8082/familie/dokument/api/mapper/familievedlegg/',
        bodyFormData,
        {
          headers: { 'content-type': 'multipart/form-data' },
          withCredentials: true,
        }
      )
      .then((response: { data: any }) => {
        console.log(response.data);

        const vedlegg: IVedlegg = {
          dokumentId: response.data,
          navn: fil.name,
          størrelse: fil.size,
          tidspunkt: dagensDatoMedTidspunktStreng,
        };

        const vedleggMedKrav: IVedleggMedKrav = {
          vedlegg: vedlegg,
          kravId: kravId,
        };

        context.leggTilVedleggMedKrav(vedleggMedKrav);
        nyeFiler.push(vedlegg);
        console.log('.then');
      });
    settFilerTilOpplasting(nyeFiler.concat(filerTilOpplasting));
    console.log('utfor');
    setCount(200);
    console.log('dww' + count);
  };

  const onDrop = useCallback(
    (filer) => {
      const feilmeldingsliste: string[] = [];

      filer.forEach((fil) => {
        if (!sjekkTillatFiltype(fil.type)) {
          feilmeldingsliste.push(fil.name + ' - Ugyldig filtype');
          settFeilmeldinger(feilmeldingsliste);
          settÅpenModal(true);
          return;
        }

        /*
        const vedlegg: IVedlegg = {
          dokumentId: fil.lastModified,
          navn: fil.name,
          størrelse: fil.size,
          tidspunkt: dagensDatoMedTidspunktStreng,
        };

        const vedleggMedKrav: IVedleggMedKrav = {
          vedlegg: vedlegg,
          kravId: kravId,
        };

        context.leggTilVedleggMedKrav(vedleggMedKrav);
        console.log('legger til vedlegg med krav');

        nyeFiler.push(vedlegg);

        */

        lastOppVedlegg(fil);
      });
    },
    [filerTilOpplasting]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => console.log('useEffect'), [count]);

  return (
    <div className="filopplaster-wrapper">
      <div className="opplastede-filer">
        <p>Nye filer:</p>
        <p>{count}</p>

        <OpplastedeFiler
          filliste={filerTilOpplasting}
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

export default Filopplaster;
