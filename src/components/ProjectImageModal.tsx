import React from 'react';

interface ProjectImageModalProps {
  imageUrl: string;
  mediaDate?: string;
  onClose: () => void;
}

const ProjectImageModal: React.FC<ProjectImageModalProps> = ({
  imageUrl,
  mediaDate,
  onClose
}) => {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <img
        src={imageUrl}
        alt="Project"
        style={{ maxWidth: '90%', maxHeight: '90%' }}
        onClick={(e) => e.stopPropagation()}
      />
      {mediaDate && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            textAlign: 'center'
          }}
        >
          {mediaDate}
        </div>
      )}
    </div>
  );
};

export default ProjectImageModal;
