import React from 'react';
import slett from '../icons/slett.svg';
import vedlegg from '../icons/vedlegg.svg';
import { Normaltekst } from 'nav-frontend-typografi';
import { IVedlegg } from '../typer/ettersending';
import '../stil/Opplastedevedlegg.less';

interface IOpplastedeVedlegg {
  vedleggsliste: IVedlegg[];
  slettVedlegg?: (vedlegg: IVedlegg) => void;
}

const OpplastedeVedlegg: React.FC<IOpplastedeVedlegg> = ({
  vedleggsliste,
  slettVedlegg,
}: IOpplastedeVedlegg) => {
  return (
    <>
      {vedleggsliste.map((fil: IVedlegg, index: number) => {
        return (
          <div key={index} className="opplastede-filer">
            <div className="fil">
              <div>
                <img
                  className="vedleggsikon"
                  src={vedlegg}
                  alt="Vedleggsikon"
                />
                <Normaltekst className="filnavn">{fil.navn}</Normaltekst>
              </div>
              {slettVedlegg && (
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
