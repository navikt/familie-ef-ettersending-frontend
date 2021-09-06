import React from 'react';
import slett from '../icons/slett.svg';
import vedlegg from '../icons/vedlegg.svg';
import { Normaltekst } from 'nav-frontend-typografi';
import { IVedleggX } from '../typer/ettersending';
import '../stil/Opplastedevedlegg.less';

interface IOpplastedeVedlegg {
  vedleggsliste: IVedleggX[];
  slettVedlegg?: (vedlegg: IVedleggX) => void;
}

const OpplastedeVedlegg: React.FC<IOpplastedeVedlegg> = ({
  vedleggsliste,
  slettVedlegg,
}: IOpplastedeVedlegg) => {
  return (
    <div className="opplastede-filer">
      {vedleggsliste.map((fil: IVedleggX, index: number) => {
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
                  {fil.navn}
                </Normaltekst>
              </div>
              {slettVedlegg && (
                <div
                  className="slett"
                  onClick={() => {
                    slettVedlegg(fil);
                  }}
                >
                  <Normaltekst>angre opplasting</Normaltekst>
                  <img className="slettikon" src={slett} alt="Rødt kryss" />
                </div>
              )}
            </div>
            {index === vedleggsliste.length - 1 ? '' : <hr />}
          </div>
        );
      })}
    </div>
  );
};

export default OpplastedeVedlegg;
