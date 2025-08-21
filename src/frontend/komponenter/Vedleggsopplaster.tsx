import React, { useState } from 'react';
import { OpplastedeVedlegg } from './OpplastedeVedlegg';
import {
  IDokumentasjonsbehov,
  IVedleggForEttersending,
} from '../typer/ettersending';
import Vedleggsvelger from './Vedleggsvelger';
import { StønadType } from '../typer/stønad';
import AlertStripe, { alertMelding } from './AlertStripe';
import { ModalWrapper } from '../felles/ModalWrapper';
import { Alert, Button, VStack } from '@navikt/ds-react';

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
        (v: IVedleggForEttersending) => v.id !== vedlegg.id,
      ),
    });
  };

  const visVedleggTilOpplasting = (): IVedleggForEttersending[] => {
    return innsending.vedlegg;
  };

  return (
    <>
      {åpenModal && (
        <ModalWrapper
          visModal={åpenModal}
          onClose={() => settÅpenModal(false)}
          tittel={'Last opp fil(er)'}
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
      )}

      <VStack gap={'2'}>
        {innsending.vedlegg.length === 0 && (
          <VStack align={'center'} justify={'space-between'}>
            {slettInnsedning && (
              <Button
                type={'button'}
                variant={'tertiary'}
                onClick={() => slettInnsedning(innsending.id)}
                title={'Slett opplastede vedlegg'}
              >
                Avbryt
              </Button>
            )}

            <Button
              variant={'secondary'}
              onClick={() => {
                settÅpenModal(true);
                settAlertStripeMelding(alertMelding.TOM);
              }}
            >
              Last opp fil(er)
            </Button>
          </VStack>
        )}

        {innsending.vedlegg.length >= 1 && !innsending.erSammenslått && (
          <Alert variant="success" size="small">
            {innsending.vedlegg.length === 1
              ? alertMelding.LASTET_OPP_EN
              : alertMelding.LASTET_OPP_FLERE}
          </Alert>
        )}

        {innsending.vedlegg.length >= 1 && innsending.erSammenslått && (
          <AlertStripe melding={alertMelding.FILER_SAMMENSLÅTT} />
        )}

        <OpplastedeVedlegg
          vedleggsliste={visVedleggTilOpplasting()}
          slettVedlegg={slettVedlegg}
        />
      </VStack>
    </>
  );
};

export default Vedleggsopplaster;
