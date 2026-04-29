import React from 'react';
import styled from 'styled-components';
import { useCountries } from '../hooks/ApiHooks';
import CountryJsonCopyModal from './CountryJsonCopyModal';

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

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
                <PrimaryButton
                  disabled
                  onClick={() => {
                    setSelectedCountryName(country.name);
                    setOpenModal('startUpdate');
                  }}
                >
                  Start Update
                </PrimaryButton>
              </td>
              <td style={{ border: '1px solid #ccc', padding: '4px 8px' }}>
                <PrimaryButton
                  onClick={() => {
                    setSelectedCountryName(country.name);
                    setOpenModal('getJson');
                  }}
                >
                  Get JSON
                </PrimaryButton>
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
            <SecondaryButton onClick={closeModal}>Close</SecondaryButton>
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
