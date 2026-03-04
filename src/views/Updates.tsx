import React from 'react';
import MetroAreasForAutoUpdates from '../components/MetroAreasForAutoUpdates';
import PasteJson from '../components/PasteJson';

const Something: React.FC = () => {
  return (
    <div
      className="something"
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        margin: '20px',
        maxWidth: '100vw',
        overflowX: 'auto'
      }}
    >
      <MetroAreasForAutoUpdates />
      <PasteJson />
    </div>
  );
};

export default Something;
