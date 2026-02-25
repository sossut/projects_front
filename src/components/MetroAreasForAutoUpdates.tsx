import React from 'react';
import styled from 'styled-components';
import { useMetroAreas } from '../hooks/ApiHooks';
import { useCountries } from '../hooks/ApiHooks';
import type { MetroArea } from '../interfaces/MetroArea';
import EditMetroArea from './EditMetroArea';
import StartMetroAreaUpdateModal from './StartMetroAreaUpdateModal';

const Table = styled.table`
  border-collapse: collapse;
  margin-bottom: 20px;
  th,
  td {
    border: 1px solid #ccc;
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
  const [isModalOpen, setIsModalOpen] = React.useState<
    'edit' | 'startUpdate' | false
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
    <>
      <h2>Metro Areas for Auto Updates</h2>
      <div>
        <label>Add new metro area</label>
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
          placeholder="Metro area name"
          value={newMetroArea.name}
          onChange={(e) =>
            setNewMetroArea((prev) => ({
              ...prev,
              name: e.target.value
            }))
          }
        />
        <button
          onClick={() => {
            // Add logic to add new metro area here
            // Example: call an API or update state
            // Reset the form after adding
            handleAddMetroArea();
          }}
          disabled={!newMetroArea.countryId || !newMetroArea.name}
        >
          Add
        </button>
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
          </tr>
        </thead>
        <tbody>
          {sortedAreas.map((area) => (
            <tr key={area.id}>
              <td>{area.countryName || area.country?.name}</td>
              <td>{area.name}</td>
              <td>{area.doAutomation ? 'Yes' : 'No'}</td>
              <td>
                {area.lastSearchedAt
                  ? new Date(area.lastSearchedAt).toLocaleString()
                  : 'Never'}
              </td>
              <td>
                <button
                  onClick={() => {
                    setSelectedArea(area);
                    setIsModalOpen('edit');
                  }}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  onClick={() => {
                    setSelectedArea(area);
                    setIsModalOpen('startUpdate');
                  }}
                >
                  Start Update
                </button>
              </td>
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
    </>
  );
};

export default MetroAreasForAutoUpdates;
