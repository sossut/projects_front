import React from 'react';
import { useCountries } from '../hooks/ApiHooks';
import CountryJsonCopyModal from './CountryJsonCopyModal';

type CountryModalType = 'startUpdate' | 'getJson' | false;

const CountriesForUpdates: React.FC = () => {
  const { countries, getCountries } = useCountries();
  const [selectedCountryName, setSelectedCountryName] = React.useState('');
  const [openModal, setOpenModal] = React.useState<CountryModalType>(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    getCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = () => {
    setOpenModal(false);
    setSelectedCountryName('');
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <h2>Countries for Updates</h2>
      <input
        type="text"
        placeholder="Search countries"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '12px', width: '100%', maxWidth: '320px' }}
      />
      <table style={{ borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc' }}>Country</th>
            <th style={{ border: '1px solid #ccc' }}>Start Update</th>
            <th style={{ border: '1px solid #ccc' }}>Get JSON</th>
          </tr>
        </thead>
        <tbody>
          {filteredCountries.map((country) => (
            <tr key={country.id}>
              <td style={{ border: '1px solid #ccc', padding: '4px 8px' }}>
                {country.name}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '4px 8px' }}>
                <button
                  disabled
                  onClick={() => {
                    setSelectedCountryName(country.name);
                    setOpenModal('startUpdate');
                  }}
                >
                  Start Update
                </button>
              </td>
              <td style={{ border: '1px solid #ccc', padding: '4px 8px' }}>
                <button
                  onClick={() => {
                    setSelectedCountryName(country.name);
                    setOpenModal('getJson');
                  }}
                >
                  Get JSON
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openModal === 'startUpdate' && (
        <div
          onClick={closeModal}
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
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              minWidth: '300px',
              color: 'black'
            }}
          >
            <h3>Start Update</h3>
            <p>Start update flow for {selectedCountryName} is coming soon.</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {openModal === 'getJson' && (
        <CountryJsonCopyModal
          countryId={
            countries.find((c) => c.name === selectedCountryName)?.id || 0
          }
          countryName={selectedCountryName}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default CountriesForUpdates;
