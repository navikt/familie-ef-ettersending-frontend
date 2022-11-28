import React, { useState } from 'react';
import { IVedleggForEttersending } from '../typer/ettersending';
import styled from 'styled-components';
import AlertStripe, { alertMelding } from './AlertStripe';
import { hentOpplastetVedlegg } from '../api-service';
import { RessursStatus } from '../typer/ressurs';
import { base64toBlob, åpnePdfIEgenTab } from '../utils/filer';
import { Attachment } from '@navikt/ds-icons';
import { Label, Link } from '@navikt/ds-react';

const IkonWrapper = styled.div`
  width: 1.5rem;
  height: 2rem;
  margin-right: 0.25rem;
`;

const FlexBox = styled.div`
  display: flex;
  word-break: break-word;
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
      {vedleggsliste.map((fil: IVedleggForEttersending) => {
        return (
          <div key={fil.id}>
            <Label as={'p'}>Dokumenter:</Label>
            <FlexBox>
              <IkonWrapper>
                <Attachment title={'Binders'} width={24} height={29} />
              </IkonWrapper>
              <Link href="#" onClick={() => visDokumentNyFane(fil)}>
                {fil.navn.replace(/_/g, '-')}
              </Link>
            </FlexBox>
          </div>
        );
      })}
      {feilmelding && <AlertStripe melding={feilmelding} />}
    </>
  );
};

export default VedleggListe;
