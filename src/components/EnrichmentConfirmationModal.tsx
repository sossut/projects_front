import React from 'react';
import styled from 'styled-components';

interface EnrichmentConfirmationModalProps {
  projectName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 28px;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  color: #fff;
`;

const Title = styled.h2`
  margin: 0 0 12px 0;
  font-size: 1.3rem;
  color: #fff;
`;

const Message = styled.p`
  margin: 0 0 16px 0;
  font-size: 0.95rem;
  opacity: 0.9;
  line-height: 1.5;
`;

const WarningBox = styled.div`
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 8px;
  padding: 12px;
  margin: 12px 0;
  font-size: 0.85rem;
  opacity: 0.95;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) =>
    props.variant === 'primary'
      ? `
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    
    &:hover:not(:disabled) {
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
      transform: translateY(-2px);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `
      : `
    background: rgba(255, 255, 255, 0.08);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.18);
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.12);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `}
`;

const EnrichmentConfirmationModal: React.FC<
  EnrichmentConfirmationModalProps
> = ({ projectName, onConfirm, onCancel, isLoading = false }) => {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>Confirm Enrichment</Title>
        <Message>
          Start enrichment for <strong>{projectName}</strong>?
        </Message>
        <WarningBox>
          ⚠️ This operation will use OpenAI API credits and incur costs. Please
          confirm you want to proceed.
        </WarningBox>
        <ButtonGroup>
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Starting...' : 'Start Enrichment'}
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EnrichmentConfirmationModal;
