import { Button, Modal } from '@navikt/ds-react';
import React from 'react';

interface ModalProps {
  tittel: string;
  visModal: boolean;
  onClose?: () => void;
  aksjonsknapper?: {
    hovedKnapp: Aksjonsknapp;
    lukkKnapp: Aksjonsknapp;
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
      </Modal.Body>
      {aksjonsknapper && (
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={aksjonsknapper.hovedKnapp.onClick}
            disabled={aksjonsknapper.hovedKnapp.disabled}
          >
            {aksjonsknapper.hovedKnapp.tekst}
          </Button>
          <Button
            variant="tertiary"
            onClick={aksjonsknapper.lukkKnapp.onClick}
            disabled={aksjonsknapper.lukkKnapp.disabled}
          >
            {aksjonsknapper.lukkKnapp.tekst}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};
