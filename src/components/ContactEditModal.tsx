import React from 'react';
import styled from 'styled-components';

interface ContactEditModalProps {
  open: boolean;
  onClose: () => void;
  type: 'developer' | 'consultant' | 'contractor' | 'architect';
  initialValues: {
    name: string;
    website: string;
    email: string;
    phone: string;
  };
  onSave: (data: {
    name: string;
    email: string;
    phone: string;
    website: string;
  }) => void;
  onCloseWithoutSaving: () => void;
  editMode: 'add' | 'edit';
}

const ContactEditModal: React.FC<ContactEditModalProps> = ({
  open,
  onClose,
  type,
  initialValues,
  onSave,
  onCloseWithoutSaving,
  editMode
}) => {
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

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
    }
  `;

  const SecondaryButton = styled(StyledButton)`
    background: rgba(0, 0, 0, 0.1);
    color: #333;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin-right: 10px;

    &:hover {
      background: rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
  `;

  const [formData, setFormData] = React.useState(initialValues);

  React.useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  if (!open) return null;
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
        <h2>{editMode === 'add' ? `Add ${type}` : `Edit ${type}`}</h2>
        <label>
          Name:
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </label>
        <label>
          Phone:
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </label>
        <label>
          Website:
          <input
            type="url"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
          />
        </label>
        <div
          style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}
        >
          <SecondaryButton onClick={onCloseWithoutSaving}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            onClick={() => {
              onSave(formData);
              onClose();
            }}
          >
            Save
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default ContactEditModal;
