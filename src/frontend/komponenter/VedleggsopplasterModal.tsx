import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import opplasting from '../icons/opplasting.svg';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import {
  IDokumentasjonsbehov,
  IVedleggForEttersending,
} from '../typer/ettersending';
import '../stil/Vedleggsopplaster.less';
import { sendVedleggTilMellomlager, slåSammenVedlegg } from '../api-service';
import styled from 'styled-components/macro';
import AlertStripe, { alertMelding } from './AlertStripe';
import { logFeilFilopplasting } from '../utils/amplitude';
import {
  erFiltypeHeic,
  formaterFilstørrelse,
  sjekkTillatFiltype,
  støtterFiltypeHeic,
  tillateFiltyper,
} from '../utils/filer';
import heic2any from 'heic2any';
import { Knapp } from 'nav-frontend-knapper';
import { DokumentType } from '../typer/stønad';
import Panel from 'nav-frontend-paneler';

const Filopplaster = styled.div<{ visSkillelinje: boolean }>`
    text-align: center;
    font-weight: bold;
    border: 2px dashed #59514b;
    border-radius: 4px;
    background-color: rgba(204, 222, 230, 0.5);
    border-bottom: ${(props) =>
      props.visSkillelinje ? '2px dashed #59514b' : ''};
    height: 64px;
    width: 1;
    color: blue;
    margin: 0 auto;
    cursor: pointer;
  }
`;

const FilopplasterWrapper = styled.div`
  max-width: 775px;
  min-height: 68px;
  border-radius: 4px;
  .opplastingsikon {
    display: inline-block;
  }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledAlertStripe = styled(AlertStripe)`
  margin-bottom: 1rem;
`;

const StyledNormaltekst = styled(Normaltekst)`
  margin-top: 1rem;
`;

const ModalWrapper = styled(Panel)`
  margin: 1.25rem;
  margin-top: 2rem;
`;

const UndertekstWrapper = styled(Undertekst)`
  padding-top: 1rem;
  padding-bottom: 1rem;
  text-align: center;
`;

interface IProps {
  oppdaterInnsending: (innsending: IDokumentasjonsbehov) => void;
  innsending: IDokumentasjonsbehov;
  maxFilstørrelse?: number;
  lukkModal: () => void;
}

const VedleggsopplasterModal: React.FC<IProps> = ({
  innsending,
  oppdaterInnsending,
  maxFilstørrelse,
  lukkModal,
}: IProps) => {
  const [feilmeldinger, settFeilmeldinger] = useState<string[]>([]);
  const [alertStripeMelding, settAlertStripeMelding] = useState<alertMelding>(
    alertMelding.TOM
  );
  const [laster, settLaster] = useState<boolean>(false);
  const [vedleggForSammenslåing, settVedleggForSammenslåing] = useState<
    IVedleggForEttersending[]
  >([]);

  const leggTilVedleggPåInnsending = (
    nyeVedlegg: IVedleggForEttersending[]
  ): IDokumentasjonsbehov => {
    return {
      ...innsending,
      vedlegg: [...innsending.vedlegg, ...nyeVedlegg],
    };
  };

  const slåSammenVedleggOgOppdaterInnsending = async () => {
    if (
      innsending.dokumenttype === DokumentType.ANNET ||
      vedleggForSammenslåing.length === 1
    ) {
      const nyInnsending = leggTilVedleggPåInnsending(vedleggForSammenslåing);
      oppdaterInnsending(nyInnsending);
    } else {
      const dokumentId = await slåSammenVedlegg(
        vedleggForSammenslåing.map((v) => v.id)
      );
      const nyInnsending = leggTilVedleggPåInnsending([
        {
          navn: vedleggForSammenslåing[0].navn,
          tittel: vedleggForSammenslåing[0].tittel,
          id: dokumentId,
        },
      ]);
      oppdaterInnsending(nyInnsending);
    }
    lukkModal();
  };

  const slettVedlegg = (vedlegg: IVedleggForEttersending): void => {
    settVedleggForSammenslåing((prevState) => {
      return prevState.filter(
        (v: IVedleggForEttersending) => v.id !== vedlegg.id
      );
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
    settVedleggForSammenslåing((prevState) => [...prevState, ...vedleggListe]);
    // const nyInnsending = leggTilVedlegg(vedleggListe);
    // oppdaterInnsending(nyInnsending);
    settLaster(false);
  };

  const onDrop = async (filerForOpplasting: File[]) => {
    const feilmeldingsliste: string[] = [];

    const filer = await Promise.all(
      filerForOpplasting.map(async (fil: File) => {
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

          return fil;
        }

        if (!sjekkTillatFiltype(fil.type)) {
          if (erFiltypeHeic(fil) && støtterFiltypeHeic()) {
            const nyBlob = await heic2any({
              blob: fil,
              toType: 'image/jpg',
              quality: 1,
            });

            const nyFil = await new File([nyBlob as Blob], fil.name + '.jpg');

            return nyFil;
          }

          const feilmelding = fil.name + ' - Ugyldig filtype';
          feilmeldingsliste.push(feilmelding);
          settFeilmeldinger(feilmeldingsliste);

          logFeilFilopplasting({
            type_feil: 'Feil filtype',
            feilmelding: feilmelding,
            filtype: fil.type,
          });

          return fil;
        }

        return fil;
      })
    );
    if (feilmeldingsliste.length <= 0) {
      lastOppVedlegg(filer);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <ModalWrapper>
      <FilopplasterWrapper>
        <Filopplaster visSkillelinje={false}>
          {feilmeldinger.length > 0 && (
            <div className="feilmelding">
              {feilmeldinger.map((feilmelding) => (
                <AlertStripeFeil
                  key={feilmelding}
                  className="feilmelding-alert"
                >
                  {feilmelding}
                </AlertStripeFeil>
              ))}
              <StyledNormaltekst>
                <b>Tillate filtyper:</b> {tillateFiltyper.join('\t')}
              </StyledNormaltekst>
            </div>
          )}
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
        </Filopplaster>
        <>
          <OpplastedeVedlegg
            vedleggsliste={vedleggForSammenslåing}
            slettVedlegg={slettVedlegg}
          />
          {laster && (
            <SpinnerWrapper>
              <NavFrontendSpinner />
            </SpinnerWrapper>
          )}
          <UndertekstWrapper>
            Hvis dokumentet du skal sende inn består av flere filer, kan du
            legge til alle filene her.
          </UndertekstWrapper>
          <StyledAlertStripe melding={alertStripeMelding} />
          <Knapp
            onClick={slåSammenVedleggOgOppdaterInnsending}
            disabled={vedleggForSammenslåing.length < 1}
          >
            Trykk her når du er ferdig med å laste opp alle filene
          </Knapp>
        </>
      </FilopplasterWrapper>
    </ModalWrapper>
  );
};

export default VedleggsopplasterModal;
