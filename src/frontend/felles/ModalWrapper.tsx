import { Button, Modal } from '@navikt/ds-react';
import React from 'react';

interface ModalProps {
  tittel: string;
  visModal: boolean;
  onClose?: () => void;
  aksjonsknapper?: {
    hovedKnapp: Aksjonsknapp;
    lukkKnapp: Aksjonsknapp;
    marginTop?: number;
  };
  children?: React.ReactNode;
}

interface Aksjonsknapp {
  onClick: () => void;
  tekst: string;
  disabled?: boolean;
}

export const ModalWrapper: React.FC<ModalProps> = ({
  tittel,
  visModal,
  onClose,
  aksjonsknapper,
  children,
}) => {
  return (
    <Modal
      open={visModal}
      onClose={onClose ? () => onClose() : () => null}
      aria-label={tittel}
      header={{ heading: tittel, closeButton: !!onClose }}
    >
      <Modal.Body>
        <div>{children}</div>
        {aksjonsknapper && (
          <div>
            <Button
              variant="tertiary"
              onClick={aksjonsknapper.lukkKnapp.onClick}
              disabled={aksjonsknapper.lukkKnapp.disabled}
            >
              {aksjonsknapper.lukkKnapp.tekst}
            </Button>
            <Button
              variant="primary"
              onClick={aksjonsknapper.hovedKnapp.onClick}
              disabled={aksjonsknapper.hovedKnapp.disabled}
            >
              {aksjonsknapper.hovedKnapp.tekst}
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
