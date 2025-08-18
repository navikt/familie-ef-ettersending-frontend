import styled from 'styled-components';
import { Button, Modal } from '@navikt/ds-react';
import React from 'react';

const Innhold = styled.div`
  margin-right: 2rem;
  margin-left: 2rem;
`;

const ButtonContainer = styled.div<{ marginTop?: number }>`
  display: flex;
  justify-content: flex-end;
  margin-top: ${(props) =>
    props.marginTop ? `${props.marginTop}rem` : '1rem'};
  margin-right: 2rem;
  margin-bottom: 0.5rem;
`;

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
        <Innhold>{children}</Innhold>
        {aksjonsknapper && (
          <ButtonContainer marginTop={aksjonsknapper.marginTop}>
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
          </ButtonContainer>
        )}
      </Modal.Body>
    </Modal>
  );
};
