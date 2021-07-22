import React, {
  useCallback,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
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
  tomInnsending,
  EttersendingType,
} from '../typer/ettersending';
import '../stil/Vedleggsopplaster.less';
import { sendVedleggTilMellomlager } from '../api-service';
import styled from 'styled-components/macro';
import { IDokumentasjonsbehov } from '../typer/dokumentasjonsbehov';

const AlertStripeFeilStyled = styled(AlertStripeFeil)`
  margin-bottom: 1rem;
`;

type VedleggsopplasterProps = { ettersendingType: EttersendingType } & (
  | {
      ettersendingType: EttersendingType.ETTERSENDING_MED_SØKNAD_DOKUMENTASJONSBEHOV;
      dokumentasjonsbehovId: string;
      dokumentasjonsbehovTilInnsending: IDokumentasjonsbehov[];
      settDokumentasjonsbehovTilInnsending: Dispatch<
        SetStateAction<IDokumentasjonsbehov[]>
      >;
    }
  | {
      ettersendingType: EttersendingType.ETTERSENDING_MED_SØKNAD_INNSENDING;
      innsending: IInnsending;
      settInnsending: Dispatch<SetStateAction<IInnsending>>;
    }
  | {
      ettersendingType: EttersendingType.ETTERSENDING_UTEN_SØKNAD;
      ettersendingUtenSøknad: IEttersendingUtenSøknad;
      settEttersendingUtenSøknad: Dispatch<
        SetStateAction<IEttersendingUtenSøknad>
      >;
    }
);

const Vedleggsopplaster: React.FC<VedleggsopplasterProps> = (
  props: VedleggsopplasterProps
) => {
  const [feilmeldinger, settFeilmeldinger] = useState<string[]>([]);
  const [visNoeGikkGalt, settVisNoeGikkGalt] = useState<boolean>(false);
  const [åpenModal, settÅpenModal] = useState<boolean>(false);
  const [vedleggTilOpplasting, settVedleggTilOpplasting] = useState<IVedlegg[]>(
    []
  );
  const [laster, settLaster] = useState<boolean>(false);

  useEffect(() => settVedleggTilOpplasting(filtrerVedleggPåBehov), []);

  const leggTilVedlegg = (vedlegg: IVedlegg) => {
    if (
      props.ettersendingType ===
      EttersendingType.ETTERSENDING_MED_SØKNAD_DOKUMENTASJONSBEHOV
    ) {
      const { dokumentasjonsbehovId, settDokumentasjonsbehovTilInnsending } =
        props;
      const oppdatertDokumentasjonsbehov: IDokumentasjonsbehov[] =
        props.dokumentasjonsbehovTilInnsending!.map((behov) => {
          if (behov.id == dokumentasjonsbehovId) {
            return {
              ...behov,
              opplastedeVedlegg: [...vedleggTilOpplasting, vedlegg],
            };
          } else {
            return behov;
          }
        });
      settDokumentasjonsbehovTilInnsending!(oppdatertDokumentasjonsbehov);
      settVedleggTilOpplasting([...vedleggTilOpplasting, vedlegg]);
    } else if (
      props.ettersendingType ===
      EttersendingType.ETTERSENDING_MED_SØKNAD_INNSENDING
    ) {
      const { settInnsending, innsending } = props;
      settInnsending({
        ...innsending,
        vedlegg: vedlegg,
      });
      settVedleggTilOpplasting([vedlegg]);
    } else if (
      props.ettersendingType === EttersendingType.ETTERSENDING_UTEN_SØKNAD
    ) {
      const { settEttersendingUtenSøknad, ettersendingUtenSøknad } = props;
      settEttersendingUtenSøknad!({
        ...ettersendingUtenSøknad!,
        innsending: [
          { ...ettersendingUtenSøknad!.innsending[0], vedlegg: vedlegg }, //TODO I fremtiden skal vi søtte flere vedlegg per ettersendingUtenSøknad og må dermed fjerne [0]
        ],
      });
      settVedleggTilOpplasting([vedlegg]);
    }
  };

  const slettVedlegg = (vedlegg: IVedlegg) => {
    if (
      props.ettersendingType ===
      EttersendingType.ETTERSENDING_MED_SØKNAD_DOKUMENTASJONSBEHOV
    ) {
      const {
        dokumentasjonsbehovTilInnsending,
        settDokumentasjonsbehovTilInnsending,
        dokumentasjonsbehovId,
      } = props;
      const oppdatertDokumentasjonsbehov =
        dokumentasjonsbehovTilInnsending!.map((behov) => {
          if (behov.id == dokumentasjonsbehovId) {
            settVedleggTilOpplasting(
              behov.opplastedeVedlegg.filter(
                (vedlegg) => vedlegg.id !== dokumentasjonsbehovId
              )
            );
            return {
              ...behov,
              opplastedeVedlegg: behov.opplastedeVedlegg.filter(
                (vedlegg) => vedlegg.id !== dokumentasjonsbehovId
              ),
            };
          } else {
            return behov;
          }
        });
      settDokumentasjonsbehovTilInnsending(oppdatertDokumentasjonsbehov);
    } else if (
      props.ettersendingType ===
      EttersendingType.ETTERSENDING_MED_SØKNAD_INNSENDING
    ) {
      const { settInnsending } = props;
      settInnsending(tomInnsending);
      settVedleggTilOpplasting(
        vedleggTilOpplasting.filter(
          (vedleggTilOpplasting) => vedleggTilOpplasting.id != vedlegg.id
        )
      );
    } else if (
      props.ettersendingType === EttersendingType.ETTERSENDING_UTEN_SØKNAD
    ) {
      const { settEttersendingUtenSøknad, ettersendingUtenSøknad } = props;
      settEttersendingUtenSøknad({
        ...ettersendingUtenSøknad,
        innsending: [],
      });
      settVedleggTilOpplasting([]);
    }
  };

  const filtrerVedleggPåBehov = () => {
    if (
      props.ettersendingType ===
      EttersendingType.ETTERSENDING_MED_SØKNAD_DOKUMENTASJONSBEHOV
    ) {
      const { dokumentasjonsbehovTilInnsending, dokumentasjonsbehovId } = props;
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

  const lastOppVedlegg = async (fil: File) => {
    settLaster(true);
    settVisNoeGikkGalt(false);

    try {
      const formData = new FormData();
      formData.append('file', fil);
      const respons = await sendVedleggTilMellomlager(formData);
      const vedlegg: IVedlegg = {
        id: respons,
        // id: '122', // Må brukes for at det skal kunne kjøre lokalt
        navn: fil.name,
      };
      leggTilVedlegg(vedlegg);
    } catch {
      settVisNoeGikkGalt(true);
    } finally {
      settLaster(false);
    }
  };

  const onDrop = useCallback(
    (vedlegg) => {
      const feilmeldingsliste: string[] = [];

      vedlegg.forEach((fil: File) => {
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
