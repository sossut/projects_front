import React from 'react';
import styled from 'styled-components';
import { useMetroAreas } from '../hooks/ApiHooks';
import { useCountries } from '../hooks/ApiHooks';
import type { MetroArea } from '../interfaces/MetroArea';
import EditMetroArea from './EditMetroArea';
import StartMetroAreaUpdateModal from './StartMetroAreaUpdateModal';
import MetroAreaJsonCopyModal from './MetroAreaJsonCopyModal';

const Table = styled.table`
  border-collapse: collapse;
  margin-bottom: 20px;
  th,
  td {
    border: 1px solid #ccc;
  }
`;

const CenteredCell = styled.td`
  text-align: center;
  vertical-align: middle;
  padding: 6px 0;
`;

const StyledButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// const PrimaryButton = styled(StyledButton)`
//   background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
//   box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);

//   &:hover:not(:disabled) {
//     transform: translateY(-2px);
//     box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
//   }
// `;

const SuccessButton = styled(StyledButton)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
  }
`;

const RowActionButton = styled(StyledButton)`
  width: 110px;
  white-space: nowrap;
`;

const RowPrimaryButton = styled(RowActionButton)`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
  }
`;

const RowSuccessButton = styled(RowActionButton)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
  }
`;

const MetroAreasForAutoUpdates: React.FC = () => {
  const {
    getMetroAreas,
    getMetroArea,
    metroAreas,
    setMetroAreas,
    addMetroArea
  } = useMetroAreas();
  const { countries, getCountries } = useCountries();
  const [sortedAreas, setSortedAreas] = React.useState<MetroArea[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState<
    'edit' | 'startUpdate' | 'copyJson' | false
  >(false);
  const [selectedArea, setSelectedArea] = React.useState<MetroArea | null>(
    null
  );

  const [newMetroArea, setNewMetroArea] = React.useState<{
    countryId: number | null;
    continentId: number | null;
    name: string;
  }>({
    countryId: null,
    continentId: null,
    name: ''
  });

  React.useEffect(() => {
    getMetroAreas();
    getCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const sort = [...metroAreas].sort((a, b) => {
      if (a.doAutomation && !b.doAutomation) return -1;
      if (!a.doAutomation && b.doAutomation) return 1;
      // Then by country
      const countryCompare =
        a.countryName?.localeCompare(b.countryName || '') || 0;
      if (countryCompare !== 0) return countryCompare;
      // Then by metro area name
      return a.name.localeCompare(b.name);
    });
    setSortedAreas(sort);
  }, [metroAreas]);

  const filteredAreas = sortedAreas.filter((area) => {
    const countryName = area.countryName || area.country?.name || '';
    const normalizedSearch = searchTerm.toLowerCase();
    return (
      area.name.toLowerCase().includes(normalizedSearch) ||
      countryName.toLowerCase().includes(normalizedSearch)
    );
  });

  const handleAddMetroArea = async () => {
    const { countryId, name } = newMetroArea;
    if (!countryId || !name) return;
    // Implement the logic to add a new metro area here
    try {
      const response = await addMetroArea(name, countryId);
      console.log('Response from adding metro area:', response);
      // Update the list of metro areas
      getMetroAreas();
      // Reset the form after adding
      setNewMetroArea({
        countryId: null,
        continentId: null,
        name: ''
      });
    } catch (error) {
      console.error('Error adding metro area:', error);
    }
  };
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ height: '120px', marginBottom: '20px' }}>
        <h2>Metro Areas for Auto Updates</h2>
        <input
          type="text"
          placeholder="Search metro areas or countries"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '8px', width: '100%', maxWidth: '320px' }}
        />
        <br />
        <label style={{ marginRight: '5px' }}>Add new metro area</label>
        <select
          value={newMetroArea.countryId ?? ''}
          onChange={(e) => {
            const countryId = e.target.value ? Number(e.target.value) : null;
            const selectedCountry = countries.find((c) => c.id === countryId);
            setNewMetroArea((prev) => ({
              ...prev,
              countryId,
              continentId: selectedCountry ? selectedCountry.continentId : null
            }));
          }}
        >
          <option value="">Select country</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          style={{ marginRight: '5px', marginLeft: '5px' }}
          placeholder="Metro area name"
          value={newMetroArea.name}
          onChange={(e) =>
            setNewMetroArea((prev) => ({
              ...prev,
              name: e.target.value
            }))
          }
        />
        <SuccessButton
          onClick={() => {
            handleAddMetroArea();
          }}
          disabled={!newMetroArea.countryId || !newMetroArea.name}
        >
          Add
        </SuccessButton>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Metro Area</th>
            <th>Automated</th>
            <th>Last Searched</th>
            <th>Edit</th>
            <th>Start Update</th>
            <th>Get Json For ChatGPT</th>
          </tr>
        </thead>
        <tbody>
          {filteredAreas.map((area) => (
            <tr key={area.id}>
              <td>{area.countryName || area.country?.name}</td>
              <td>{area.name}</td>
              <td>{area.doAutomation ? 'Yes' : 'No'}</td>
              <td>
                {area.lastSearchedAt
                  ? new Date(area.lastSearchedAt).toLocaleString()
                  : 'Never'}
              </td>
              <CenteredCell>
                <RowPrimaryButton
                  onClick={() => {
                    setSelectedArea(area);
                    setIsModalOpen('edit');
                  }}
                >
                  Edit
                </RowPrimaryButton>
              </CenteredCell>
              <CenteredCell>
                <RowSuccessButton
                  onClick={() => {
                    setSelectedArea(area);
                    setIsModalOpen('startUpdate');
                  }}
                >
                  Start Update
                </RowSuccessButton>
              </CenteredCell>
              <CenteredCell>
                <RowPrimaryButton
                  onClick={() => {
                    setSelectedArea(area);
                    setIsModalOpen('copyJson');
                  }}
                >
                  Get JSON
                </RowPrimaryButton>
              </CenteredCell>
            </tr>
          ))}
        </tbody>
      </Table>
      {isModalOpen === 'edit' && selectedArea && (
        <EditMetroArea
          id={selectedArea.id}
          name={selectedArea.name}
          doAutomation={selectedArea.doAutomation || false}
          onAreaUpdated={async (data) => {
            console.log('Saving data:', data);
            setIsModalOpen(false);
            setSelectedArea(null);

            const updatedArea = await getMetroArea(data.id);

            // Update the source of truth
            setMetroAreas((prev) =>
              prev.map((area) =>
                area.id === data.id ? { ...area, ...updatedArea } : area
              )
            );
          }}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedArea(null);
          }}
        />
      )}
      {isModalOpen === 'startUpdate' && selectedArea && (
        <StartMetroAreaUpdateModal
          metroArea={selectedArea}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedArea(null);
          }}
        />
      )}
      {isModalOpen === 'copyJson' && selectedArea && (
        <MetroAreaJsonCopyModal
          metroAreaName={selectedArea.name || ''}
          metroAreaId={selectedArea.id}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedArea(null);
          }}
        />
      )}
    </div>
  );
};

export default MetroAreasForAutoUpdates;
