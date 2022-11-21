import React, { useState } from 'react';
import { IVedleggForEttersending } from '../typer/ettersending';
import { base64toBlob, åpnePdfIEgenTab } from '../utils/filer';
import { hentOpplastetVedlegg } from '../api-service';
import { RessursStatus } from '../typer/ressurs';
import Lenke from 'nav-frontend-lenker';
import styled from 'styled-components';
import AlertStripe, { alertMelding } from './AlertStripe';
import { BodyShort } from '@navikt/ds-react';
import { Attachment, Delete } from '@navikt/ds-icons';
import KnappMedPadding from '../felles/Knapp';

const FlexBox = styled.div`
  position: relative;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
  }
`;

const IkonOgTekstDiv = styled.div`
  position: relative;
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  @media (max-width: 576px) {
    justify-content: center;
  }
`;

const SlettKnapp = styled(KnappMedPadding)`
  min-width: 10.5rem;
  max-width: 14rem;
  @media (max-width: 576px) {
    margin-top: 0.5rem;
  }
`;

const FilNavnWrapper = styled.div`
  margin-left: 1rem;
`;

const Divider = styled.hr`
  border: 1px solid var(--navds-semantic-color-divider);
`;

const IkonWrapper = styled.div`
  width: 1.5rem;
  height: 2rem;
`;

interface IOpplastedeVedlegg {
  vedleggsliste: IVedleggForEttersending[];
  slettVedlegg: (vedlegg: IVedleggForEttersending) => void;
}

const OpplastedeVedlegg: React.FC<IOpplastedeVedlegg> = ({
  vedleggsliste,
  slettVedlegg,
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
      {vedleggsliste.map((fil: IVedleggForEttersending, index: number) => {
        return (
          <div key={fil.id}>
            <FlexBox>
              <IkonOgTekstDiv>
                <IkonWrapper>
                  <Attachment title={'Binders'} width={24} height={29} />
                </IkonWrapper>
                <FilNavnWrapper>
                  <BodyShort>
                    <strong>Navn: </strong>
                    <Lenke href="#" onClick={() => visDokumentNyFane(fil)}>
                      {fil.navn}
                    </Lenke>
                  </BodyShort>
                </FilNavnWrapper>
              </IkonOgTekstDiv>
              <SlettKnapp
                type={'button'}
                variant={'tertiary'}
                icon={<Delete title={'Søppeldunk'} />}
                onClick={() => {
                  slettVedlegg(fil);
                }}
                size={'small'}
              >
                Angre opplasting
              </SlettKnapp>
            </FlexBox>
            {index === vedleggsliste.length - 1 ? null : <Divider />}
          </div>
        );
      })}
      {feilmelding && <AlertStripe melding={feilmelding} />}
    </>
  );
};

export default OpplastedeVedlegg;
