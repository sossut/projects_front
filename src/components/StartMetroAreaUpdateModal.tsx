import React from 'react';
import type { MetroArea } from '../interfaces/MetroArea';
import { useEnrichment } from '../hooks/ApiHooks';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const SuccessButton = styled(StyledButton)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
  }
`;

const SecondaryButton = styled(StyledButton)`
  background: rgba(0, 0, 0, 0.1);
  color: #333;
  border: 1px solid rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

interface StartMetroAreaUpdateModalProps {
  metroArea: MetroArea;
  onClose: () => void;
}

const StartMetroAreaUpdateModal: React.FC<StartMetroAreaUpdateModalProps> = ({
  metroArea,
  onClose
}) => {
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);

  const { startProjectSearch } = useEnrichment();
  const startUpdate = async () => {
    if (
      window.confirm(
        `Are you sure you want to start the update for ${selectedTypes.join(', ')} in ${metroArea.name} ?`
      )
    ) {
      console.log(
        `Starting search for ${selectedTypes.join(', ')} in ${metroArea.name} (ID: ${metroArea.id})`
      );
      // Implement the logic to start the update process for the metro area here
      startProjectSearch(
        selectedTypes,
        metroArea.name,
        metroArea.countryName || ''
      );
      onClose();
    }
  };
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          minWidth: '300px',
          color: 'black'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Start Auto Update</h2>

        <div id="checkboxes" style={{ marginTop: 16 }}>
          <label>
            <input
              type="checkbox"
              value="A"
              onChange={(e) => {
                const value = e.target.value;
                setSelectedTypes((prev) =>
                  prev.includes(value)
                    ? prev.filter((type) => type !== value)
                    : [...prev, value]
                );
              }}
            />
            Skyscrapers
          </label>
          <label style={{ marginLeft: 16 }}>
            <input
              type="checkbox"
              value="B"
              onChange={(e) => {
                const value = e.target.value;
                setSelectedTypes((prev) =>
                  prev.includes(value)
                    ? prev.filter((type) => type !== value)
                    : [...prev, value]
                );
              }}
            />
            High-rises 50-150m
          </label>
          <label style={{ marginLeft: 16 }}>
            <input
              type="checkbox"
              value="C"
              onChange={(e) => {
                const value = e.target.value;
                setSelectedTypes((prev) =>
                  prev.includes(value)
                    ? prev.filter((type) => type !== value)
                    : [...prev, value]
                );
              }}
            />
            Major civic or commercial building
          </label>
          <label style={{ marginLeft: 16 }}>
            <input
              type="checkbox"
              value="D"
              onChange={(e) => {
                const value = e.target.value;
                setSelectedTypes((prev) =>
                  prev.includes(value)
                    ? prev.filter((type) => type !== value)
                    : [...prev, value]
                );
              }}
            />
            Industrial buildings
          </label>
        </div>
        <SuccessButton
          onClick={() => {
            // Implement start update logic here
            startUpdate();
          }}
        >
          Yes, Start Update
        </SuccessButton>
        <SecondaryButton onClick={onClose} style={{ marginLeft: 8 }}>
          Cancel
        </SecondaryButton>
      </div>
    </div>
  );
};

export default StartMetroAreaUpdateModal;
