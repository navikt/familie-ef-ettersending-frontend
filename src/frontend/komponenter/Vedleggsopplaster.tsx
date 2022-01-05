import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Normaltekst } from 'nav-frontend-typografi';
import opplasting from '../icons/opplasting.svg';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import Modal from 'nav-frontend-modal';
import {
  IDokumentasjonsbehov,
  IVedleggForEttersending,
} from '../typer/ettersending';
import '../stil/Vedleggsopplaster.less';
import { sendVedleggTilMellomlager } from '../api-service';
import styled from 'styled-components/macro';
import AlertStripe, { alertMelding } from './AlertStripe';
import { logFeilFilopplasting } from '../utils/amplitude';
import { formaterFilstørrelse } from '../utils/filer';
import heic2any from 'heic2any';

const StyledAlertStripe = styled(AlertStripe)`
  margin-bottom: 1rem;
`;

const StyledNormaltekst = styled(Normaltekst)`
  margin-top: 1rem;
`;

interface IProps {
  oppdaterInnsending: (innsending: IDokumentasjonsbehov) => void;
  innsending: IDokumentasjonsbehov;
  maxFilstørrelse?: number;
}

const Vedleggsopplaster: React.FC<IProps> = ({
  innsending,
  oppdaterInnsending,
  maxFilstørrelse,
}: IProps) => {
  const [feilmeldinger, settFeilmeldinger] = useState<string[]>([]);
  const [alertStripeMelding, settAlertStripeMelding] = useState<alertMelding>(
    alertMelding.TOM
  );
  const [åpenModal, settÅpenModal] = useState<boolean>(false);
  const [laster, settLaster] = useState<boolean>(false);

  const [imageUrl, setImageUrl] = useState('');

  const leggTilVedlegg = (
    nyeVedlegg: IVedleggForEttersending[]
  ): IDokumentasjonsbehov => {
    return {
      ...innsending,
      vedlegg: [...innsending.vedlegg, ...nyeVedlegg],
    };
  };
  const tillateFiltyper = ['pdf', 'jpg', 'png', 'jpeg'];

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

  const sjekkTillatFiltype = (filtype: string) => {
    return tillateFiltyper.some((type) => {
      return filtype.includes(type);
    });
  };

  const lastOppVedlegg = async (filer: File[]) => {
    settLaster(true);
    settAlertStripeMelding(alertMelding.TOM);

    const vedleggListe: IVedleggForEttersending[] = [];

    await Promise.all(
      filer.map(async (fil) => {
        try {
          const formData = new FormData();
          formData.append('file', fil);
          const respons = await sendVedleggTilMellomlager(formData);
          const vedlegg: IVedleggForEttersending = {
            id: respons,
            navn: fil.name,
            tittel: innsending.beskrivelse || 'Ukjent tittel',
          };
          vedleggListe.push(vedlegg);
        } catch {
          settAlertStripeMelding(alertMelding.FEIL);

          logFeilFilopplasting({
            type_feil: 'Generisk feil',
            feilmelding: alertMelding.FEIL,
            filtype: fil.type,
            filstørrelse: fil.size,
          });
        }
      })
    );
    const nyInnsending = leggTilVedlegg(vedleggListe);
    oppdaterInnsending(nyInnsending);
    settLaster(false);
  };

  const onDrop = (filer: File[]) => {
    const feilmeldingsliste: string[] = [];

    filer.forEach(async (fil: File, i: number, listen: File[]) => {
      if (maxFilstørrelse && fil.size > maxFilstørrelse) {
        const maks = formaterFilstørrelse(maxFilstørrelse);

        const feilmelding = `${fil.name} er for stor (maksimal filstørrelse er ${maks})`;

        feilmeldingsliste.push(feilmelding);
        settFeilmeldinger(feilmeldingsliste);

        logFeilFilopplasting({
          type_feil: 'For stor fil',
          feilmelding: feilmelding,
          filstørrelse: fil.size,
        });

        settÅpenModal(true);
        return;
      }

      if (!sjekkTillatFiltype(fil.type)) {
        console.log('FEIL FIL', fil);

        if (
          fil.type.toLowerCase() === 'image/heic' ||
          fil.type.toLowerCase() === 'image/heif' ||
          fil.name.toLowerCase().endsWith('.heic')
        ) {
          console.log('HEIC. KONVERTERER');

          const nyBlob = await heic2any({
            blob: fil,
            toType: 'image/jpg',
            quality: 1,
          });

          const nyFil = await new File([nyBlob as Blob], fil.name + '.jpg');

          setImageUrl(URL.createObjectURL(nyFil));

          console.log('NYFIL', nyFil);

          listen[i] = nyFil;

          return;
        }

        const feilmelding = fil.name + ' - Ugyldig filtype';
        feilmeldingsliste.push(feilmelding);
        settFeilmeldinger(feilmeldingsliste);

        logFeilFilopplasting({
          type_feil: 'Feil filtype',
          feilmelding: feilmelding,
          filtype: fil.type,
        });

        settÅpenModal(true);
        return;
      }
    });
    if (feilmeldingsliste.length <= 0) {
      console.log('FILER SOM LASTES OPP', filer);
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
            <StyledNormaltekst>
              <b>Tillate filtyper:</b> {tillateFiltyper.join('\t')}
            </StyledNormaltekst>
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
          <img src={imageUrl} />
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
