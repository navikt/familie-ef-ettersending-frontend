import React from 'react';
import slett from '../icons/slett.svg';
import vedlegg from '../icons/vedlegg.svg';
import { Normaltekst } from 'nav-frontend-typografi';
import { IVedleggForEttersending } from '../typer/ettersending';
import '../stil/Opplastedevedlegg.less';
import { base64toBlob, åpnePdfIEgenTab } from '../utils/filer';
import { hentOpplastetVedlegg } from '../api-service';
import { RessursStatus } from '../typer/ressurs';
import Lenke from 'nav-frontend-lenker';

interface IOpplastedeVedlegg {
  vedleggsliste: IVedleggForEttersending[];
  slettVedlegg?: (vedlegg: IVedleggForEttersending) => void;
}

const OpplastedeVedlegg: React.FC<IOpplastedeVedlegg> = ({
  vedleggsliste,
  slettVedlegg,
}: IOpplastedeVedlegg) => {
  const visDokumentNyFane = async (vedlegg: IVedleggForEttersending) => {
    console.log(vedlegg);
    const opplastetVedlegg = await hentOpplastetVedlegg(vedlegg.id);
    if (opplastetVedlegg.status === RessursStatus.SUKSESS) {
      åpnePdfIEgenTab(
        base64toBlob(opplastetVedlegg.data, 'application/pdf'),
        vedlegg.navn
      );
    }
  };

  return (
    <div className="opplastede-filer">
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
    </div>
  );
};

export default OpplastedeVedlegg;
