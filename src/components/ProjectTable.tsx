// ...existing code...
import React, { useState } from 'react';
import styled from 'styled-components';

import {
  useProjects,
  useCities,
  useCountries,
  useMetroAreas,
  useBuildingUses,
  useBuildingTypes
} from '../hooks/ApiHooks';
import type { BuildingUse } from '../interfaces/BuildingUse';
import ProjectInfoModal from './ProjectInfoModal';
import ProjectImageModal from './ProjectImageModal';
import type { City } from '../interfaces/City';
import DropdownCheckbox from './DropdownCheckbox';
import type { MetroArea } from '../interfaces/MetroArea';
import type { Country } from '../interfaces/Country';
import type { BuildingType } from '../interfaces/BuildinType';

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

const FilterDiv = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
`;

const ProjectTable = () => {
  const {
    projects,
    getProjectsSimple,
    statuses,
    getStatuses,
    projectCount,
    getProjectCount
  } = useProjects();
  const { cities, getCities } = useCities();
  const { countries, getCountries } = useCountries();
  const { metroAreas, getMetroAreas } = useMetroAreas();
  const { buildingUses, getBuildingUses } = useBuildingUses();
  const { buildingTypes, getBuildingTypes } = useBuildingTypes();

  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = React.useState<
    number | null
  >(null);
  const [isModalOpen, setIsModalOpen] = React.useState<null | 'image' | 'info'>(
    null
  );
  const [filters, setFilters] = React.useState({
    city: [] as string[],
    status: [] as string[],
    metroArea: [] as string[],
    country: [] as string[],
    buildingType: [] as string[],
    buildingUse: [] as string[],
    minBudget: '',
    maxBudget: '',
    minHeightMeters: '',
    maxHeightMeters: ''
  });
  const [filterDraft, setFilterDraft] = React.useState(filters);

  const [sortKey, setSortKey] = useState('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [pageCount, setPageCount] = useState(1);
  const [restored, setRestored] = useState(false);

  const calculatePageCount = (totalCount: number, pageSize: number) => {
    return Math.ceil(totalCount / pageSize);
  };

  const serializeFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v) params.append(key, v);
        });
      } else {
        if (value) params.append(key, value);
      }
    });
    return params.toString();
  };

  React.useEffect(() => {
    getCities();
    getCountries();
    getMetroAreas();
    getStatuses();
    getBuildingUses();
    getBuildingTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!restored) return;
    getProjectsSimple(serializeFilters(), sortKey, order, pageSize, page);
    getProjectCount(serializeFilters());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortKey, order, pageSize, page, restored]);

  React.useEffect(() => {
    setPageCount(calculatePageCount(projectCount, pageSize));
  }, [projectCount, pageSize]);

  React.useEffect(() => {
    console.log(projects);
  }, [projects]);

  // Restore state from localStorage on mount, then trigger fetch after all state is set

  React.useEffect(() => {
    const saved = localStorage.getItem('projectTableState');
    if (saved) {
      const { filters, sortKey, order, pageSize } = JSON.parse(saved);
      setFilters(filters);
      setFilterDraft(filters);
      setSortKey(sortKey);
      setOrder(order);
      setPageSize(pageSize);
      setRestored(true);
    } else {
      setRestored(true);
    }
  }, []);

  React.useEffect(() => {
    if (restored) {
      getProjectsSimple(serializeFilters(), sortKey, order, pageSize, 1);
      getProjectCount(serializeFilters());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restored]);
  if (!projects || projects.length === 0) {
    return <p>No data available</p>;
  }
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
        <label>Order:</label>
        <select onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div></div>
      <FilterDiv>
        <label>Filter by:</label>

        <DropdownCheckbox
          options={((cities as unknown as City[]) ?? []).map((c) => c.name)}
          selected={filterDraft.city}
          onChange={(cityArr) =>
            setFilterDraft((prev) => ({ ...prev, city: cityArr }))
          }
          label="City"
        />
        <DropdownCheckbox
          options={statuses}
          selected={filterDraft.status}
          onChange={(statusArr) =>
            setFilterDraft((prev) => ({ ...prev, status: statusArr }))
          }
          label="Status"
        />
        <DropdownCheckbox
          options={((metroAreas as unknown as MetroArea[]) ?? []).map(
            (m) => m.name
          )}
          selected={filterDraft.metroArea}
          onChange={(metroAreaArr) =>
            setFilterDraft((prev) => ({ ...prev, metroArea: metroAreaArr }))
          }
          label="Metro Area"
        />
        <DropdownCheckbox
          options={((countries as unknown as Country[]) ?? []).map(
            (c) => c.name
          )}
          selected={filterDraft.country}
          onChange={(countryArr) =>
            setFilterDraft((prev) => ({ ...prev, country: countryArr }))
          }
          label="Country"
        />
        <DropdownCheckbox
          options={((buildingTypes as unknown as BuildingType[]) ?? []).map(
            (b) => b.buildingType
          )}
          selected={filterDraft.buildingType}
          onChange={(buildingTypeArr) =>
            setFilterDraft((prev) => ({
              ...prev,
              buildingType: buildingTypeArr
            }))
          }
          label="Building Type"
        />
        <DropdownCheckbox
          options={((buildingUses as unknown as BuildingUse[]) ?? []).map(
            (b) => b.buildingUse
          )}
          selected={filterDraft.buildingUse}
          onChange={(buildingUseArr) =>
            setFilterDraft((prev) => ({ ...prev, buildingUse: buildingUseArr }))
          }
          label="Building Use"
        />
        <input
          type="number"
          placeholder="Min Budget"
          value={filterDraft.minBudget}
          onChange={(e) =>
            setFilterDraft((prev) => ({ ...prev, minBudget: e.target.value }))
          }
        />
        <input
          type="number"
          placeholder="Max Budget"
          value={filterDraft.maxBudget}
          onChange={(e) =>
            setFilterDraft((prev) => ({ ...prev, maxBudget: e.target.value }))
          }
        />
        <input
          type="number"
          placeholder="Min Height (m)"
          value={filterDraft.minHeightMeters}
          onChange={(e) =>
            setFilterDraft((prev) => ({
              ...prev,
              minHeightMeters: e.target.value
            }))
          }
        />
        <input
          type="number"
          placeholder="Max Height (m)"
          value={filterDraft.maxHeightMeters}
          onChange={(e) =>
            setFilterDraft((prev) => ({
              ...prev,
              maxHeightMeters: e.target.value
            }))
          }
        />
        <button
          onClick={() => {
            setFilters(filterDraft);
            localStorage.setItem(
              'projectTableState',
              JSON.stringify({ filters: filterDraft, sortKey, order, pageSize })
            );
          }}
          style={{ marginRight: 8 }}
        >
          Set Filters
        </button>
        <button
          onClick={() => {
            setFilters({
              city: [],
              status: [],
              metroArea: [],
              country: [],
              buildingType: [],
              buildingUse: [],
              minBudget: '',
              maxBudget: '',
              minHeightMeters: '',
              maxHeightMeters: ''
            });
            // Optionally fetch all projects after clearing
            getProjectsSimple('', sortKey, order, pageSize, page);
            setFilterDraft({
              city: [],
              status: [],
              metroArea: [],
              country: [],
              buildingType: [],
              buildingUse: [],
              minBudget: '',
              maxBudget: '',
              minHeightMeters: '',
              maxHeightMeters: ''
            });
            localStorage.removeItem('projectTableState');
          }}
        >
          Clear Filters
        </button>
      </FilterDiv>
      <div>
        <button
          onClick={() => {
            setPage((prev) => Math.max(prev - 1, 1));
            getProjectsSimple(
              serializeFilters(),
              sortKey,
              order,
              pageSize,
              Math.max(page - 1, 1)
            );
          }}
        >
          Previous
        </button>
        <span>
          Page {page} of {pageCount}
        </span>
        <button
          onClick={() => {
            setPage((prev) => prev + 1);
            getProjectsSimple(
              serializeFilters(),
              sortKey,
              order,
              pageSize,
              page + 1
            );
          }}
          disabled={page >= pageCount}
        >
          Next
        </button>
        <label>Page Size:</label>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value={2}>2</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
        </select>
        <button
          onClick={() => {
            setPage(1);
            getProjectsSimple(
              serializeFilters(),
              sortKey,
              order,
              Number(pageSize),
              1
            );
          }}
        >
          Set Page Size
        </button>
      </div>
      <span>Total projects with these filters: {projectCount}</span>
      <div style={{ margin: '16px 0' }}>
        <button
          onClick={() => {
            getProjectsSimple(serializeFilters(), sortKey, order, pageSize, 1);
            getProjectCount(serializeFilters());
          }}
        >
          Refresh
        </button>
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
