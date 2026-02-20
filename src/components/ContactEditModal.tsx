import React from 'react';

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
          <button onClick={onCloseWithoutSaving} style={{ marginRight: 10 }}>
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(formData);
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactEditModal;
