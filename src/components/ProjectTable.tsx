// ...existing code...
import React, { useState } from 'react';
import styled from 'styled-components';

import { useProjects } from '../hooks/ApiHooks';
import type { BuildingUse } from '../interfaces/BuildingUse';
import ProjectInfoModal from './ProjectInfoModal';
import ProjectImageModal from './ProjectImageModal';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const THead = styled.thead`
  background-color: #515050;
  color: white;
`;

const TH = styled.th`
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
`;

const TD = styled.td`
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
`;

const ProjectTable = () => {
  const { projects, getProjectsSimple } = useProjects();
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = React.useState<
    number | null
  >(null);
  const [isModalOpen, setIsModalOpen] = React.useState<null | 'image' | 'info'>(
    null
  );
  const [filter, setFilter] = React.useState({
    city: '',
    status: '',
    continent: '',
    metroArea: '',
    country: '',
    buildingType: '',
    buildingUse: '',
    minBudget: '',
    maxBudget: '',
    minHeight: '',
    maxHeight: ''
  });

  const [sortKey, setSortKey] = useState('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  React.useEffect(() => {
    getProjectsSimple();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    console.log(projects);
  }, [projects]);
  return (
    <div>
      <div>
        <label>Sort by:</label>
        <select onChange={(e) => setSortKey(e.target.value)}>
          <option value="id">ID</option>
          <option value="name">Name</option>
          <option value="expectedDate">Date</option>
          <option value="buildingHeightMeters">Height (m)</option>
          <option value="buildingHeightFloors">Height (floors)</option>
          <option value="lastVerifiedDate">Last verified date</option>
        </select>
      </div>
      <div>
        <label>Filter by:</label>
        <input
          type="text"
          placeholder="City"
          value={filter.city}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, city: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Status"
          value={filter.status}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, status: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Continent"
          value={filter.continent}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, continent: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Metro Area"
          value={filter.metroArea}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, metroArea: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Country"
          value={filter.country}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, country: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Building Type"
          value={filter.buildingType}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, buildingType: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Building Use"
          value={filter.buildingUse}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, buildingUse: e.target.value }))
          }
        />
        <input
          type="number"
          placeholder="Min Budget"
          value={filter.minBudget}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, minBudget: e.target.value }))
          }
        />
        <input
          type="number"
          placeholder="Max Budget"
          value={filter.maxBudget}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, maxBudget: e.target.value }))
          }
        />
        <input
          type="number"
          placeholder="Min Height (m)"
          value={filter.minHeight}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, minHeight: e.target.value }))
          }
        />
        <input
          type="number"
          placeholder="Max Height (m)"
          value={filter.maxHeight}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, maxHeight: e.target.value }))
          }
        />
      </div>
      <Table>
        <THead>
          <tr>
            <TH>ID</TH>
            <TH>Name</TH>
            <TH>City</TH>
            <TH>Country</TH>
            <TH>Status</TH>
            <TH>Building Type</TH>
            <TH>Building Uses</TH>
            <TH>Height (m)</TH>
            <TH>Height (Floors)</TH>
            <TH>Expected Completion Date</TH>
            <TH>Images</TH>
            <TH>More Info</TH>
          </tr>
        </THead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <TD>{project.id}</TD>
              <TD>{project.name}</TD>
              <TD>{project.city as string}</TD>
              <TD>{project.country as string}</TD>
              <TD>{project.status}</TD>
              <TD>{project.buildingType}</TD>
              <TD>
                {(project.buildingUses as BuildingUse[] | undefined)?.map(
                  (use, idx) => (
                    <span key={use.id as number}>
                      {use.buildingUse}
                      {idx < (project.buildingUses as BuildingUse[]).length - 1
                        ? ', '
                        : ''}
                    </span>
                  )
                )}
              </TD>
              <TD>{project.buildingHeightMeters}</TD>
              <TD>{project.buildingHeightFloors}</TD>
              <TD>{project.expectedDateText}</TD>

              <TD>
                {project.projectMedias?.map((media) => (
                  <img
                    key={media.id}
                    src={media.url}
                    alt="Project"
                    style={{ height: 100, marginRight: 5 }}
                    onClick={() => {
                      setSelectedImage(media.url);
                      setIsModalOpen('image');
                    }}
                  />
                ))}
              </TD>
              <TD>
                <button
                  onClick={() => {
                    setSelectedProjectId(project.id as number);
                    setIsModalOpen('info');
                  }}
                >
                  More Info
                </button>
              </TD>
            </tr>
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
    </div>
  );
};

export default ProjectTable;
