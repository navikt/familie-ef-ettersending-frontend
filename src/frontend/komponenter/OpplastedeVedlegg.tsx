import React from 'react';
import slett from '../icons/slett.svg';
import vedlegg from '../icons/vedlegg.svg';
import { Normaltekst } from 'nav-frontend-typografi';
import { IVedlegg } from '../typer/søknadsdata';
import '../stil/Vedleggsopplaster.less';

interface IOpplastedeVedlegg {
  vedleggsliste: IVedlegg[];
  kanSlettes: boolean;
  slettVedlegg?: (vedlegg: IVedlegg) => void;
}

const OpplastedeVedlegg: React.FC<IOpplastedeVedlegg> = ({
  vedleggsliste,
  slettVedlegg,
  kanSlettes,
}: IOpplastedeVedlegg) => {
  return (
    <>
      {vedleggsliste.map((fil: IVedlegg, index: number) => {
        return (
          <div key={index}>
            <div className="fil">
              <div>
                <img
                  className="vedleggsikon"
                  src={vedlegg}
                  alt="Vedleggsikon"
                />
                <Normaltekst className="filnavn">{fil.navn}</Normaltekst>
                <Normaltekst className="filstørrelse">
                  {fil.størrelse + ' Bytes'}
                </Normaltekst>
              </div>
              {kanSlettes && (
                <div
                  className="slett"
                  onClick={() => {
                    slettVedlegg(fil);
                  }}
                >
                  <Normaltekst>slett</Normaltekst>
                  <img className="slettikon" src={slett} alt="Rødt kryss" />
                </div>
              )}
            </div>
            {index === vedleggsliste.length - 1 ? '' : <hr />}
          </div>
        );
      })}
    </>
  );
};

export default OpplastedeVedlegg;
