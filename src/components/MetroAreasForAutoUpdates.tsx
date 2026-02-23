import React from 'react';
import styled from 'styled-components';
import { useMetroAreas } from '../hooks/ApiHooks';
import type { MetroArea } from '../interfaces/MetroArea';
import EditMetroArea from './EditMetroArea';

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
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
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
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {sortedAreas.map((area) => (
            <tr key={area.id}>
              <td>{area.countryName || area.country?.name}</td>
              <td>{area.name}</td>
              <td>{area.doAutomation ? 'Yes' : 'No'}</td>
              <td>
                <button
                  onClick={() => {
                    setSelectedArea(area);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {isEditModalOpen && selectedArea && (
        <EditMetroArea
          id={selectedArea.id}
          name={selectedArea.name}
          doAutomation={selectedArea.doAutomation || false}
          onAreaUpdated={async (data) => {
            console.log('Saving data:', data);
            setIsEditModalOpen(false);
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
            setIsEditModalOpen(false);
            setSelectedArea(null);
          }}
        />
      )}
    </>
  );
};

export default MetroAreasForAutoUpdates;
