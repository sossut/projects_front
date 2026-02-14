import React from 'react';

interface ProjectImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ProjectImageModal: React.FC<ProjectImageModalProps> = ({
  imageUrl,
  onClose
}) => {
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
    </div>
  );
};

export default ProjectImageModal;
