import React from 'react';
import styled from 'styled-components';
import { useMetroAreas } from '../hooks/ApiHooks';
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
  const { getMetroAreas, getMetroArea, metroAreas, setMetroAreas } =
    useMetroAreas();

  const [sortedAreas, setSortedAreas] = React.useState<MetroArea[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState<
    'edit' | 'startUpdate' | false
  >(false);
  const [selectedArea, setSelectedArea] = React.useState<MetroArea | null>(
    null
  );

  React.useEffect(() => {
    getMetroAreas();
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

  return (
    <>
      <h2>Metro Areas for Auto Updates</h2>
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
