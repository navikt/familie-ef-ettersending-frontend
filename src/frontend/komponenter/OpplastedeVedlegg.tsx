import React, { useState } from 'react';
import slett from '../icons/slett.svg';
import vedlegg from '../icons/vedlegg.svg';
import { Normaltekst } from 'nav-frontend-typografi';
import { IVedleggForEttersending } from '../typer/ettersending';
import { base64toBlob, åpnePdfIEgenTab } from '../utils/filer';
import { hentOpplastetVedlegg } from '../api-service';
import { RessursStatus } from '../typer/ressurs';
import Lenke from 'nav-frontend-lenker';
import styled from 'styled-components';
import AlertStripe, { alertMelding } from './AlertStripe';

const Container = styled.div`
  .fil {
    position: relative;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;

    .typo-normal {
      display: inline-block;
    }

    .filstørrelse {
      margin-left: 10px;
    }

    .filnavn {
      margin-left: 1rem;
    }

    .vedleggsikon {
      position: relative;
      top: 0px;
    }

    .slett {
      position: relative;
      top: 5px;
      color: blue;
      cursor: pointer;

      p {
        text-decoration: underline;
      }

      .slettikon {
        margin-left: 10px;
      }
    }
  }

  hr {
    border: 1px solid #b7b1a9;
  }
`;

interface IOpplastedeVedlegg {
  vedleggsliste: IVedleggForEttersending[];
  slettVedlegg?: (vedlegg: IVedleggForEttersending) => void;
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
    } catch (error: any) {
      settFeilmelding(alertMelding.FEIL_NEDLASTING_DOKUMENT);
    }
  };

  return (
    <Container>
      {vedleggsliste.map((fil: IVedleggForEttersending, index: number) => {
        return (
          <div key={index}>
            <div className="fil">
              <div className="fil">
                <img
                  className="vedleggsikon"
                  src={vedlegg}
                  alt="Vedleggsikon"
                />
                <Normaltekst className="filnavn">
                  <b>Navn: </b>
                  <Lenke href="#" onClick={() => visDokumentNyFane(fil)}>
                    {fil.navn}
                  </Lenke>
                </Normaltekst>
              </div>
              {slettVedlegg && (
                <div
                  className="slett"
                  onClick={() => {
                    slettVedlegg(fil);
                  }}
                >
                  <Normaltekst>Angre opplasting</Normaltekst>
                  <img className="slettikon" src={slett} alt="Rødt kryss" />
                </div>
              )}
            </div>
            {index === vedleggsliste.length - 1 ? '' : <hr />}
          </div>
        );
      })}
      {feilmelding && <AlertStripe melding={feilmelding} />}
    </Container>
  );
};

export default OpplastedeVedlegg;
