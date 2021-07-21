import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Normaltekst } from 'nav-frontend-typografi';
import opplasting from '../icons/opplasting.svg';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import Modal from 'nav-frontend-modal';
import {
  IVedlegg,
  IEttersendingUtenSøknad,
  IInnsending,
} from '../typer/ettersending';
import '../stil/Vedleggsopplaster.less';
import { sendVedleggTilMellomlager } from '../api-service';
import styled from 'styled-components/macro';
import { IDokumentasjonsbehov } from '../typer/dokumentasjonsbehov';

const AlertStripeFeilStyled = styled(AlertStripeFeil)`
  margin-bottom: 1rem;
`;
interface IVedleggsopplaster {
  dokumentasjonsbehovId?: string;
  dokumentasjonsbehovTilInnsending?: IDokumentasjonsbehov[];
  settDokumentasjonsbehovTilInnsending?: (
    dokumentasjonsbehov: IDokumentasjonsbehov[]
  ) => void;
  innsending?: IInnsending;
  settInnsending?: (dokumentasjonsbehov: IInnsending) => void;
  ettersendingUtenSøknad?: IEttersendingUtenSøknad;
  settEttersendingUtenSøknad?: (
    ettersendingUtenSøknad: IEttersendingUtenSøknad
  ) => void;
}

const Vedleggsopplaster: React.FC<IVedleggsopplaster> = ({
  dokumentasjonsbehovId,
  settDokumentasjonsbehovTilInnsending,
  dokumentasjonsbehovTilInnsending,
  settInnsending,
  innsending,
  settEttersendingUtenSøknad,
  ettersendingUtenSøknad,
}: IVedleggsopplaster) => {
  const [feilmeldinger, settFeilmeldinger] = useState<string[]>([]);
  const [visNoeGikkGalt, settVisNoeGikkGalt] = useState<boolean>(false);
  const [åpenModal, settÅpenModal] = useState<boolean>(false);
  const [vedleggTilOpplasting, settVedleggTilOpplasting] = useState<IVedlegg[]>(
    []
  );
  const [laster, settLaster] = useState<boolean>(false);

  useEffect(() => settVedleggTilOpplasting(filtrerVedleggPåBehov), []);

  const leggTilVedleggForEttersendingMedSøknad = (vedlegg: IVedlegg) => {
    const oppdatertDokumentasjonsbehov: IDokumentasjonsbehov[] =
      dokumentasjonsbehovTilInnsending.map((behov) => {
        if (behov.id == dokumentasjonsbehovId) {
          settVedleggTilOpplasting([...behov.opplastedeVedlegg, vedlegg]);
          return {
            ...behov,
            opplastedeVedlegg: [...behov.opplastedeVedlegg, vedlegg],
          };
        } else {
          return behov;
        }
      });
    settDokumentasjonsbehovTilInnsending(oppdatertDokumentasjonsbehov);
  };

  const leggTilVedleggForInnsending = (vedlegg: IVedlegg) => {
    settInnsending({
      ...innsending,
      vedlegg: vedlegg,
    });
    settVedleggTilOpplasting([vedlegg]);
  };

  const leggTilVedleggForEttersendingUtenSøknad = (vedlegg: IVedlegg) => {
    settEttersendingUtenSøknad({
      ...ettersendingUtenSøknad,
      innsending: [
        { ...ettersendingUtenSøknad.innsending[0], vedlegg: vedlegg }, //TODO I fremtiden skal vi søtte flere vedlegg per ettersendingUtenSøknad og må dermed fjerne [0]
      ],
    });
    settVedleggTilOpplasting([vedlegg]);
  };

  const slettVedleggForEttersendingMedSøknad = (
    dokumentId: string,
    dokumentasjonsbehovId: string
  ) => {
    const oppdatertDokumentasjonsbehov = dokumentasjonsbehovTilInnsending.map(
      (behov) => {
        if (behov.id == dokumentasjonsbehovId) {
          settVedleggTilOpplasting(
            behov.opplastedeVedlegg.filter(
              (vedlegg) => vedlegg.id !== dokumentId
            )
          );
          return {
            ...behov,
            opplastedeVedlegg: behov.opplastedeVedlegg.filter(
              (vedlegg) => vedlegg.id !== dokumentId
            ),
          };
        } else {
          return behov;
        }
      }
    );
    settDokumentasjonsbehovTilInnsending(oppdatertDokumentasjonsbehov);
  };

  const slettVedleggForInnsending = (vedlegg: IVedlegg) => {
    settInnsending({
      ...innsending,
      vedlegg: null,
    });
    settVedleggTilOpplasting(
      vedleggTilOpplasting.filter(
        (vedleggTilOpplasting) => vedleggTilOpplasting.id != vedlegg.id
      )
    );
  };

  const slettVedleggForEttersendingUtenSøknad = () => {
    settEttersendingUtenSøknad({
      ...ettersendingUtenSøknad,
      innsending: [
        {
          ...ettersendingUtenSøknad.innsending[0], //TODO I fremtiden skal vi støtte flere innsendinger i denne listen
          vedlegg: null,
        },
      ],
    });
    settVedleggTilOpplasting([]);
  };

  const filtrerVedleggPåBehov = () => {
    if (dokumentasjonsbehovId) {
      dokumentasjonsbehovTilInnsending.forEach((behov) => {
        if (dokumentasjonsbehovId === behov.id) {
          return behov.opplastedeVedlegg;
        }
      });
      return [];
    } else return [];
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
      slettVedleggForEttersendingMedSøknad(vedlegg.id, dokumentasjonsbehovId);
    else if (innsending) slettVedleggForInnsending(vedlegg);
    else slettVedleggForEttersendingUtenSøknad();
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
        //id: '122', // Må brukes for at det skal kunne kjøre lokalt
        navn: fil.name,
      };
      if (dokumentasjonsbehovId)
        leggTilVedleggForEttersendingMedSøknad(vedlegg);
      else if (innsending) leggTilVedleggForInnsending(vedlegg);
      else leggTilVedleggForEttersendingUtenSøknad(vedlegg);
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
