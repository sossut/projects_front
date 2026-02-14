import React, { useEffect } from 'react';

import styled from 'styled-components';
import ProjectTableHeader from './ProjectTableHeader';
import ProjectTableRow from './ProjectTableRow';
import ProjectTableCell from './ProjectTableCell';
import { useProjects } from '../hooks/ApiHooks';
import type { BuildingUse } from '../interfaces/BuildingUse';
import ProjectImageModal from './ProjectImageModal';
import ProjectInfoModal from './ProjectInfoModal';
interface ProjectTableProps {
  data: { [key: string]: unknown }[];
}

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const columns = [
  { label: 'ID', key: 'id' },
  { label: 'Name', key: 'name' },
  { label: 'Country', key: 'country' },
  { label: 'City', key: 'city' },
  { label: 'Status', key: 'status' },
  { label: 'Building Type', key: 'buildingType' },
  { label: 'Building Uses', key: 'buildingUses' },
  { label: 'Height (m)', key: 'buildingHeightMeters' },
  { label: 'Height (Floors)', key: 'buildingHeightFloors' },
  { label: 'Expected Completion Date', key: 'expectedDateText' },
  { label: 'Images', key: 'projectMedias' },
  { label: 'More Info', key: 'info' }
];
const ProjectTable: React.FC<ProjectTableProps> = () => {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = React.useState<
    number | null
  >(null);
  const [isModalOpen, setIsModalOpen] = React.useState<null | 'image' | 'info'>(
    null
  );
  const { projects, getProjectsSimple, loading, error } = useProjects();
  useEffect(() => {
    getProjectsSimple();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    console.log(projects);
  }, [projects]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!projects || projects.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <Table>
      <thead>
        <ProjectTableRow>
          {columns.map((column) => (
            <ProjectTableHeader key={column.key}>
              {column.label}
            </ProjectTableHeader>
          ))}
        </ProjectTableRow>
      </thead>
      <tbody>
        {projects.map((row, rowIndex) => (
          <ProjectTableRow key={rowIndex}>
            {columns.map((column, cellIndex) => {
              let value = row[column.key as keyof typeof row] || '';
              if (column.key === 'buildingUses' && Array.isArray(value)) {
                return (
                  <ProjectTableCell key={cellIndex}>
                    {(value as BuildingUse[]).map((use, idx) => (
                      <span key={idx}>
                        {use.buildingUse}
                        {idx < (value as BuildingUse[]).length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </ProjectTableCell>
                );
              }

              if (column.key === 'projectMedias' && Array.isArray(value)) {
                return (
                  <ProjectTableCell key={cellIndex}>
                    {(value as { url: string }[]).map((media, idx) => (
                      <img
                        key={idx}
                        src={media.url}
                        alt="Project"
                        style={{ height: 100 }}
                        onClick={() => {
                          setSelectedImage(media.url);
                          setIsModalOpen('image');
                        }}
                      />
                    ))}
                  </ProjectTableCell>
                );
              }
              if (column.key === 'info') {
                return (
                  <ProjectTableCell key={cellIndex}>
                    <button
                      onClick={() => {
                        setSelectedProjectId(row.id as number);
                        setIsModalOpen('info');
                      }}
                    >
                      More Info
                    </button>
                  </ProjectTableCell>
                );
              } else if (typeof value === 'object' && value !== null) {
                value = JSON.stringify(value);
              }
              return (
                <ProjectTableCell key={cellIndex}>{value}</ProjectTableCell>
              );
            })}
          </ProjectTableRow>
        ))}
      </tbody>
      {isModalOpen === 'image' && selectedImage && (
        <ProjectImageModal
          imageUrl={selectedImage}
          onClose={() => setIsModalOpen(null)}
        />
      )}
      {isModalOpen === 'info' && selectedProjectId !== null && (
        <ProjectInfoModal
          id={selectedProjectId}
          onClose={() => setIsModalOpen(null)}
        />
      )}
    </Table>
  );
};

export default ProjectTable;
