import React from 'react';
import styled from 'styled-components';
import MetroAreasForAutoUpdates from '../components/MetroAreasForAutoUpdates';
import PasteJson from '../components/PasteJson';
import CountriesForUpdates from '../components/CountriesForUpdates';

const ToggleBar = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
`;

const ToggleButton = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ active }) =>
    active
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'};
  box-shadow: ${({ active }) =>
    active
      ? '0 4px 12px rgba(16, 185, 129, 0.25)'
      : '0 4px 12px rgba(59, 130, 246, 0.25)'};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ active }) =>
      active
        ? '0 6px 16px rgba(16, 185, 129, 0.35)'
        : '0 6px 16px rgba(59, 130, 246, 0.35)'};
  }
`;

const Something: React.FC = () => {
  const [metrosOrCountries, setMetrosOrCountries] = React.useState<
    'metros' | 'countries'
  >('metros');
  return (
    <div>
      <ToggleBar>
        <ToggleButton
          active={metrosOrCountries === 'metros'}
          onClick={() => setMetrosOrCountries('metros')}
        >
          Show Metro Areas for Auto Updates
        </ToggleButton>
        <ToggleButton
          active={metrosOrCountries === 'countries'}
          onClick={() => setMetrosOrCountries('countries')}
        >
          Show Countries for Updates
        </ToggleButton>
      </ToggleBar>
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
