import React, { useState } from 'react';
import vedlegg from '../icons/vedlegg.svg';
import { IVedleggForEttersending } from '../typer/ettersending';
import styled from 'styled-components/macro';
import AlertStripe, { alertMelding } from './AlertStripe';
import { hentOpplastetVedlegg } from '../api-service';
import { RessursStatus } from '../typer/ressurs';
import { base64toBlob, åpnePdfIEgenTab } from '../utils/filer';
import Lenke from 'nav-frontend-lenker';

interface IOpplastedeVedlegg {
  vedleggsliste: IVedleggForEttersending[];
}

const StyledSpan = styled.span`
  text-decoration: underline;
`;

const StyledImg = styled.img`
  position: relative;
  top: -2px;
  margin-left: 0.3rem;
`;

const OpplastedeVedleggOversikt: React.FC<IOpplastedeVedlegg> = ({
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
    } catch (error: any) {
      settFeilmelding(alertMelding.FEIL_NEDLASTING_DOKUMENT);
    }
  };

  return (
    <>
      {vedleggsliste.map((fil: IVedleggForEttersending, index) => {
        return (
          <StyledSpan key={index}>
            <StyledImg src={vedlegg} alt="Vedleggsikon" />{' '}
            <Lenke href="#" onClick={() => visDokumentNyFane(fil)}>
              {fil.navn}
            </Lenke>
          </StyledSpan>
        );
      })}
      {feilmelding && <AlertStripe melding={feilmelding} />}
    </>
  );
};

export default OpplastedeVedleggOversikt;
