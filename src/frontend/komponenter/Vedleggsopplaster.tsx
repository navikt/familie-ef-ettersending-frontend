import React, { useState } from 'react';
import OpplastedeVedlegg from './OpplastedeVedlegg';
import {
  IDokumentasjonsbehov,
  IVedleggForEttersending,
} from '../typer/ettersending';
import Vedleggsvelger from './Vedleggsvelger';
import styled from 'styled-components';
import { StønadType } from '../typer/stønad';
import AlertStripe, { alertMelding } from './AlertStripe';
import KnappMedPadding from '../felles/Knapp';
import { ModalWrapper } from '../felles/ModalWrapper';

const FlexBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilopplasterWrapper = styled.div`
  max-width: 48rem;
`;

const AlertStripeMedPadding = styled(AlertStripe)`
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

const KnappMedMargin = styled(KnappMedPadding)`
  margin: 0.25rem 0.5rem;
`;

interface IProps {
  oppdaterInnsending: (innsending: IDokumentasjonsbehov) => void;
  innsending: IDokumentasjonsbehov;
  slettInnsedning?: (id: string) => void;
  maxFilstørrelse?: number;
  stønadType?: StønadType;
  beskrivelse: string;
  settAlertStripeMelding: (melding: alertMelding) => void;
}

const Vedleggsopplaster: React.FC<IProps> = ({
  innsending,
  slettInnsedning,
  oppdaterInnsending,
  maxFilstørrelse,
  stønadType,
  beskrivelse,
  settAlertStripeMelding,
}: IProps) => {
  const [åpenModal, settÅpenModal] = useState<boolean>(false);

  const slettVedlegg = (vedlegg: IVedleggForEttersending): void => {
    oppdaterInnsending({
      ...innsending,
      vedlegg: [...innsending.vedlegg].filter(
        (v: IVedleggForEttersending) => v.id !== vedlegg.id
      ),
    });
  };

  const visVedleggTilOpplasting = (): IVedleggForEttersending[] => {
    return innsending.vedlegg;
  };

  return (
    <>
      <ModalWrapper
        tittel={''}
        visModal={åpenModal}
        onClose={() => settÅpenModal(false)}
        maxWidth={38}
        ariaLabel={beskrivelse}
      >
        <Vedleggsvelger
          oppdaterInnsending={oppdaterInnsending}
          innsending={innsending}
          lukkModal={() => settÅpenModal(false)}
          maxFilstørrelse={maxFilstørrelse}
          stønadType={stønadType}
          beskrivelse={beskrivelse}
        />
      </ModalWrapper>
      <FilopplasterWrapper>
        {innsending.vedlegg.length === 0 && (
          <FlexBox>
            {slettInnsedning && (
              <KnappMedMargin
                type={'button'}
                variant={'tertiary'}
                onClick={() => slettInnsedning(innsending.id)}
                title={'Slett opplastede vedlegg'}
              >
                Avbryt
              </KnappMedMargin>
            )}
            <KnappMedMargin
              variant={'secondary'}
              onClick={() => {
                settÅpenModal(true);
                settAlertStripeMelding(alertMelding.TOM);
              }}
            >
              Last opp fil(er)
            </KnappMedMargin>
          </FlexBox>
        )}
        {innsending.vedlegg.length >= 1 && !innsending.erSammenslått && (
          <AlertStripeMedPadding
            melding={
              innsending.vedlegg.length === 1
                ? alertMelding.LASTET_OPP_EN
                : alertMelding.LASTET_OPP_FLERE
            }
          />
        )}
        {innsending.vedlegg.length >= 1 && innsending.erSammenslått && (
          <AlertStripeMedPadding melding={alertMelding.FILER_SAMMENSLÅTT} />
        )}
        <OpplastedeVedlegg
          vedleggsliste={visVedleggTilOpplasting()}
          slettVedlegg={slettVedlegg}
        />
      </FilopplasterWrapper>
    </>
  );
};

export default Vedleggsopplaster;
