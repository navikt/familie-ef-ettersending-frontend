import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Normaltekst } from 'nav-frontend-typografi';
import opplasting from '../icons/opplasting.svg';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import Modal from 'nav-frontend-modal';
import { IVedlegg } from '../typer/søknadsdata';
import '../stil/Vedleggsopplaster.less';
import { dagensDatoMedTidspunktStreng } from '../../shared-utils/dato';
import { useApp } from '../context/AppContext';
import { sendVedleggTilMellomlager } from '../api-service';
import styled from 'styled-components/macro';

const AlertStripeFeilStyled = styled(AlertStripeFeil)`
  margin-bottom: 1rem;
`;

interface IVedleggsopplaster {
  dokumentasjonsbehovId?: string;
}

const Vedleggsopplaster: React.FC<IVedleggsopplaster> = ({
  dokumentasjonsbehovId,
}: IVedleggsopplaster) => {
  const [feilmeldinger, settFeilmeldinger] = useState<string[]>([]);
  const [visNoeGikkGalt, settVisNoeGikkGalt] = useState<boolean>(false);
  const [åpenModal, settÅpenModal] = useState<boolean>(false);
  const [vedleggTilOpplasting, settVedleggTilOpplasting] = useState<IVedlegg[]>(
    []
  );
  const [laster, settLaster] = useState<boolean>(false);
  const context = useApp();

  useEffect(() => settVedleggTilOpplasting(filtrerVedleggPåBehov), []);

  const leggTilFilTilOpplasting = (vedlegg: IVedlegg) => {
    settVedleggTilOpplasting((nyListeMedVedlegg) => [
      ...nyListeMedVedlegg,
      vedlegg,
    ]);
  };

  const filtrerVedleggPåBehov = () => {
    context.dokumentasjonsbehov.forEach((behov) => {
      if (dokumentasjonsbehovId === behov.id) {
        return behov.opplastedeVedlegg;
      }
    });
    return [];
  };

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
    if (dokumentasjonsbehovId)
      context.slettVedlegg(vedlegg.id, dokumentasjonsbehovId);
    else {
      context.slettVedleggForÅpenEttersending(vedlegg.id);
    }
    const oppdatertVedleggsliste = vedleggTilOpplasting.filter(
      (fil) => fil !== vedlegg
    );
    settVedleggTilOpplasting(oppdatertVedleggsliste);
  };

  const lastOppVedlegg = async (fil) => {
    settLaster(true);
    settVisNoeGikkGalt(false);

    try {
      const formData = new FormData();
      formData.append('file', fil);
      const respons = await sendVedleggTilMellomlager(formData);
      const vedlegg: IVedlegg = {
        id: respons,
        // id: '122', Må brukes for at det skal kunne kjøre lokalt
        navn: fil.name,
        størrelse: fil.size,
        tidspunkt: dagensDatoMedTidspunktStreng,
      };

      if (dokumentasjonsbehovId) {
        context.leggTilVedlegg(vedlegg, dokumentasjonsbehovId);
      } else {
        context.leggTilVedleggForÅpenEttersending(vedlegg);
      }
      leggTilFilTilOpplasting(vedlegg);
    } catch {
      settVisNoeGikkGalt(true);
    } finally {
      settLaster(false);
    }
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
        {laster ? (
          <NavFrontendSpinner />
        ) : (
          <>
            <OpplastedeVedlegg
              vedleggsliste={vedleggTilOpplasting}
              kanSlettes={true}
              slettVedlegg={slettVedlegg}
            />
            {visNoeGikkGalt && (
              <AlertStripeFeilStyled>
                Noe gikk galt, prøv igjen
              </AlertStripeFeilStyled>
            )}
          </>
        )}
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
