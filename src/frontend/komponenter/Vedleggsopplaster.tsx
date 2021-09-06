import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Normaltekst } from 'nav-frontend-typografi';
import opplasting from '../icons/opplasting.svg';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import Modal from 'nav-frontend-modal';
import { IInnsendingX, IVedleggX } from '../typer/ettersending';
import '../stil/Vedleggsopplaster.less';
import { sendVedleggTilMellomlager } from '../api-service';
import styled from 'styled-components/macro';
import AlertStripe, { alertMelding } from './AlertStripe';

const StyledAlertStripe = styled(AlertStripe)`
  margin-bottom: 1rem;
`;

interface IProps {
  oppdaterInnsendingx: (innsending: IInnsendingX) => void;
  innsendingx: IInnsendingX;
}

const Vedleggsopplaster: React.FC<IProps> = ({
  innsendingx,
  oppdaterInnsendingx,
}: IProps) => {
  const [feilmeldinger, settFeilmeldinger] = useState<string[]>([]);
  const [alertStripeMelding, settAlertStripeMelding] = useState<alertMelding>(
    alertMelding.TOM
  );
  const [åpenModal, settÅpenModal] = useState<boolean>(false);
  const [laster, settLaster] = useState<boolean>(false);

  const leggTilVedlegg = (nyeVedlegg: IVedleggX[]): IInnsendingX => {
    return {
      ...innsendingx,
      vedlegg: [...innsendingx.vedlegg, ...nyeVedlegg],
    };
  };

  const slettVedlegg = (vedlegg: IVedleggX): void => {
    oppdaterInnsendingx({
      ...innsendingx,
      vedlegg: [...innsendingx.vedlegg].filter(
        (v: IVedleggX) => v.id !== vedlegg.id
      ),
    });
  };

  const visVedleggTilOpplasting = (): IVedleggX[] => {
    return innsendingx.vedlegg;
  };

  const sjekkTillatFiltype = (filtype: string) => {
    const tillateFiltyper = ['pdf', 'jpg', 'svg', 'png', 'jpeg', 'gif', 'ico'];
    return tillateFiltyper.some((type) => {
      return filtype.includes(type);
    });
  };

  const lastOppVedlegg = async (filer: File[]) => {
    settLaster(true);
    settAlertStripeMelding(alertMelding.TOM);

    const vedleggxListe: IVedleggX[] = [];
    await Promise.all(
      filer.map(async (fil) => {
        try {
          const formData = new FormData();
          formData.append('file', fil);
          const respons = await sendVedleggTilMellomlager(formData);
          const vedlegg: IVedleggX = {
            id: respons,
            navn: fil.name,
          };
          vedleggxListe.push(vedlegg);
        } catch {
          settAlertStripeMelding(alertMelding.FEIL);
        }
      })
    );
    const nyInnsending = leggTilVedlegg(vedleggxListe);
    oppdaterInnsendingx(nyInnsending);
    settLaster(false);
  };

  const onDrop = (filer: File[]) => {
    const feilmeldingsliste: string[] = [];

    filer.forEach((fil: File) => {
      if (!sjekkTillatFiltype(fil.type)) {
        feilmeldingsliste.push(fil.name + ' - Ugyldig filtype');
        settFeilmeldinger(feilmeldingsliste);
        settÅpenModal(true);
        return;
      }
    });
    if (feilmeldingsliste.length <= 0) {
      lastOppVedlegg(filer);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div className="filopplaster-wrapper">
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
            {isDragActive ? 'Last opp fil(er)' : 'Last opp fil(er)'}
          </Normaltekst>
        </div>
      </div>
      {laster ? (
        <NavFrontendSpinner />
      ) : (
        <>
          <OpplastedeVedlegg
            vedleggsliste={visVedleggTilOpplasting()}
            slettVedlegg={slettVedlegg}
          />
          <StyledAlertStripe melding={alertStripeMelding} />
        </>
      )}
    </div>
  );
};

export default Vedleggsopplaster;
