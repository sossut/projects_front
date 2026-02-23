import React from 'react';

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
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default EditMetroArea;
