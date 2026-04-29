import React from 'react';
import styled from 'styled-components';

import { useMetroAreas } from '../hooks/ApiHooks';

interface EditMetroAreaProps {
  id: number;
  name: string;
  doAutomation: boolean;
  onAreaUpdated?: (data: {
    id: number;
    name: string;
    doAutomation: boolean;
  }) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

const EditMetroArea: React.FC<EditMetroAreaProps> = ({
  id,
  name,
  doAutomation,
  onAreaUpdated,
  onCancel,
  onClose
}) => {
  const { updateMetroArea } = useMetroAreas();
  const StyledButton = styled.button`
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  `;

  const PrimaryButton = styled(StyledButton)`
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
    margin-right: 8px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
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

  const [formData, setFormData] = React.useState({
    name,
    doAutomation
  });

  const handleSave = async () => {
    try {
      const updatedArea = await updateMetroArea(id, formData);
      if (updatedArea) {
        onAreaUpdated?.(updatedArea);
        onClose?.();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          background: 'white',
          padding: 32,
          borderRadius: 8,
          minWidth: 300,
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
        }}
      >
        <h2>Edit Metro Area</h2>
        <label>
          Name:
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </label>
        <label>
          Automated:
          <input
            type="checkbox"
            checked={formData.doAutomation}
            onChange={(e) =>
              setFormData({ ...formData, doAutomation: e.target.checked })
            }
          />
        </label>
        <button
          onClick={() => {
            handleSave();
          }}
        >
          Save
        </button>
        <PrimaryButton
          onClick={() => {
            handleSave();
          }}
        >
          Save
        </PrimaryButton>
        <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
      </div>
    </div>
  );
};

export default EditMetroArea;
