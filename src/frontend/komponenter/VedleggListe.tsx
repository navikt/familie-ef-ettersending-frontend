import React, { useState } from 'react';
import { IVedleggForEttersending } from '../typer/ettersending';
import styled from 'styled-components/macro';
import AlertStripe, { alertMelding } from './AlertStripe';
import { hentOpplastetVedlegg } from '../api-service';
import { RessursStatus } from '../typer/ressurs';
import { base64toBlob, åpnePdfIEgenTab } from '../utils/filer';
import Lenke from 'nav-frontend-lenker';
import { Attachment } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

const Grid = styled.span`
  display: grid;
  grid-template-columns: 6.5rem 1.75rem 20rem;
`;

interface IOpplastedeVedlegg {
  vedleggsliste: IVedleggForEttersending[];
}

const VedleggListe: React.FC<IOpplastedeVedlegg> = ({
  vedleggsliste,
}: IOpplastedeVedlegg) => {
  const [feilmelding, settFeilmelding] = useState<alertMelding>(
    alertMelding.TOM
  );

  const visDokumentNyFane = async (vedlegg: IVedleggForEttersending) => {
    settFeilmelding(alertMelding.TOM);
    try {
      const opplastetVedlegg = await hentOpplastetVedlegg(vedlegg.id);
      if (opplastetVedlegg.status === RessursStatus.SUKSESS) {
        åpnePdfIEgenTab(
          base64toBlob(opplastetVedlegg.data, 'application/pdf'),
          vedlegg.navn
        );
      }
    } catch (error: unknown) {
      settFeilmelding(alertMelding.FEIL_NEDLASTING_DOKUMENT);
    }
  };

  return (
    <>
      {vedleggsliste.map((fil: IVedleggForEttersending, index) => {
        return (
          <Grid key={index}>
            <BodyShort>
              <strong>Dokumenter: </strong>
            </BodyShort>
            <Attachment title={'Binders'} width={24} height={29} />
            <Lenke href="#" onClick={() => visDokumentNyFane(fil)}>
              {fil.navn}
            </Lenke>
          </Grid>
        );
      })}
      {feilmelding && <AlertStripe melding={feilmelding} />}
    </>
  );
};

export default VedleggListe;
