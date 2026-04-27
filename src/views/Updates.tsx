import React from 'react';
import MetroAreasForAutoUpdates from '../components/MetroAreasForAutoUpdates';
import PasteJson from '../components/PasteJson';
import CountriesForUpdates from '../components/CountriesForUpdates';

const Something: React.FC = () => {
  const [metrosOrCountries, setMetrosOrCountries] = React.useState<
    'metros' | 'countries'
  >('metros');
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
        <button onClick={() => setMetrosOrCountries('metros')}>
          Show Metro Areas for Auto Updates
        </button>
        <button onClick={() => setMetrosOrCountries('countries')}>
          Show Countries for Updates
        </button>
      </div>
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
        {metrosOrCountries === 'metros' ? (
          <MetroAreasForAutoUpdates />
        ) : (
          <CountriesForUpdates />
        )}
        <PasteJson />
      </div>
    </div>
  );
};

export default Something;
