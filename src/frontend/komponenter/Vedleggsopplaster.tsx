import React, { useState, Dispatch, SetStateAction } from 'react';
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
import AlertStripe, { alertMelding } from './AlertStripe';
import { kjørerLokalt } from '../../shared-utils/miljø';

const StyledAlertStripe = styled(AlertStripe)`
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
  const [alertStripeMelding, settAlertStripeMelding] = useState<alertMelding>(
    alertMelding.TOM
  );
  const [åpenModal, settÅpenModal] = useState<boolean>(false);
  const [laster, settLaster] = useState<boolean>(false);

  const leggTilVedlegg = (vedlegg: IVedlegg[]) => {
    if (
      props.ettersendingType ===
      EttersendingType.ETTERSENDING_MED_SØKNAD_DOKUMENTASJONSBEHOV
    ) {
      const {
        dokumentasjonsbehovId,
        settDokumentasjonsbehovTilInnsending,
        dokumentasjonsbehovTilInnsending,
      } = props;
      const oppdatertDokumentasjonsbehov: IDokumentasjonsbehov[] =
        dokumentasjonsbehovTilInnsending.map((behov) => {
          if (behov.id == dokumentasjonsbehovId) {
            return {
              ...behov,
              opplastedeVedlegg: [...behov.opplastedeVedlegg, ...vedlegg],
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
      const { settInnsending, innsending } = props;
      settInnsending({
        ...innsending,
        vedlegg: vedlegg[0],
      });
    } else if (
      props.ettersendingType === EttersendingType.ETTERSENDING_UTEN_SØKNAD
    ) {
      const { settEttersendingUtenSøknad, ettersendingUtenSøknad } = props;
      settEttersendingUtenSøknad({
        ...ettersendingUtenSøknad,
        innsending: [
          { ...ettersendingUtenSøknad.innsending[0], vedlegg: vedlegg[0] }, //TODO I fremtiden skal vi søtte flere vedlegg per ettersendingUtenSøknad og må dermed fjerne [0]
        ],
      });
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
      const oppdatertDokumentasjonsbehov = dokumentasjonsbehovTilInnsending.map(
        (behov) => {
          if (behov.id == dokumentasjonsbehovId) {
            return {
              ...behov,
              opplastedeVedlegg: behov.opplastedeVedlegg.filter(
                (vedleggIOpplastedeVedlegg) =>
                  vedlegg.id !== vedleggIOpplastedeVedlegg.id
              ),
            };
          } else {
            return behov;
          }
        }
      );
      settDokumentasjonsbehovTilInnsending(oppdatertDokumentasjonsbehov);
    } else if (
      props.ettersendingType ===
      EttersendingType.ETTERSENDING_MED_SØKNAD_INNSENDING
    ) {
      const { settInnsending } = props;
      settInnsending(tomInnsending);
    } else if (
      props.ettersendingType === EttersendingType.ETTERSENDING_UTEN_SØKNAD
    ) {
      const { settEttersendingUtenSøknad, ettersendingUtenSøknad } = props;
      settEttersendingUtenSøknad({
        ...ettersendingUtenSøknad,
        innsending: [
          {
            beskrivelse: ettersendingUtenSøknad.innsending[0].beskrivelse, //TODO i fremtiden skal vi støtte innsending av flere filer, og må da fjerne [0]
            dokumenttype: ettersendingUtenSøknad.innsending[0].dokumenttype, //TODO i fremtiden skal vi støtte innsending av flere filer, og må da fjerne [0]
            vedlegg: null,
          },
        ],
      });
    }
  };

  const visVedleggTilOpplasting = (): IVedlegg[] => {
    if (
      props.ettersendingType ===
      EttersendingType.ETTERSENDING_MED_SØKNAD_DOKUMENTASJONSBEHOV
    ) {
      const { dokumentasjonsbehovId, dokumentasjonsbehovTilInnsending } = props;
      const dokumentasjonsbehov = dokumentasjonsbehovTilInnsending.filter(
        (behov) => behov.id === dokumentasjonsbehovId
      )[0];
      return dokumentasjonsbehov ? dokumentasjonsbehov.opplastedeVedlegg : [];
    } else if (
      props.ettersendingType ===
      EttersendingType.ETTERSENDING_MED_SØKNAD_INNSENDING
    ) {
      const { innsending } = props;
      return innsending.vedlegg ? [innsending.vedlegg] : [];
    } else if (
      props.ettersendingType === EttersendingType.ETTERSENDING_UTEN_SØKNAD
    ) {
      const { ettersendingUtenSøknad } = props;
      return ettersendingUtenSøknad.innsending[0].vedlegg
        ? [ettersendingUtenSøknad.innsending[0].vedlegg]
        : []; //TODO i fremtiden skal vi støtte innsending av flere filer, og må da fjerne [0]
    }
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

  const lastOppVedlegg = async (filer: File[]) => {
    settLaster(true);
    settAlertStripeMelding(alertMelding.TOM);

    const vedleggListe: IVedlegg[] = [];
    await Promise.all(
      filer.map(async (fil) => {
        try {
          const formData = new FormData();
          formData.append('file', fil);
          const respons = await sendVedleggTilMellomlager(formData);
          const vedlegg: IVedlegg = {
            id: kjørerLokalt() ? '123' : respons,
            navn: fil.name,
          };
          vedleggListe.push(vedlegg);
        } catch {
          settAlertStripeMelding(alertMelding.FEIL);
        }
      })
    );
    leggTilVedlegg(vedleggListe);
    settLaster(false);
  };

  const onDrop = (filer: File[]) => {
    const feilmeldingsliste: string[] = [];
    if (
      props.ettersendingType !=
        EttersendingType.ETTERSENDING_MED_SØKNAD_DOKUMENTASJONSBEHOV &&
      filer.length > 1
    ) {
      console.log('for mange filer');
      feilmeldingsliste.push(
        'I dette feltet kan du maksimalt laste opp en fil'
      );
      settFeilmeldinger(feilmeldingsliste);
      settÅpenModal(true);
    }

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="filopplaster-wrapper">
      <p>Nye filer:</p>
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
