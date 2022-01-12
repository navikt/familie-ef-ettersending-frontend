import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Normaltekst } from 'nav-frontend-typografi';
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

const VedleggsopplasterModal: React.FC<IProps> = ({
  innsending,
  oppdaterInnsending,
  maxFilstørrelse,
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
    if (innsending.dokumenttype === DokumentType.ANNET) {
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
  };

  const slettVedlegg = (vedlegg: IVedleggForEttersending): void => {
    settVedleggForSammenslåing((prevState) => {
      return prevState.filter(
        (v: IVedleggForEttersending) => v.id !== vedlegg.id
      );
    });
  };

  const visVedleggTilOpplasting = (): IVedleggForEttersending[] => {
    return innsending.vedlegg;
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
    settVedleggForSammenslåing(vedleggListe);
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
    <div className="filopplaster-wrapper">
      <div className="filopplaster">
        {feilmeldinger.length > 0 && (
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
          <Knapp onClick={slåSammenVedleggOgOppdaterInnsending}>
            Trykk her når du er ferdig med å laste opp alle filene
          </Knapp>
        </>
      )}
    </div>
  );
};

export default VedleggsopplasterModal;
