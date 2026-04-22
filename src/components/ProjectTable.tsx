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
import type { Project } from '../interfaces/Project';

import { AppContext } from '../contexts/AppContext';
import favoritedIcon from '../assets/star-symbol-icon.png';
import checkedIcon from '../assets/check-mark-icon.png';
import unfavoritedIcon from '../assets/star.png';
const Table = styled.table`
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  table-layout: auto;
  font-size: 0.85rem;

  @media (max-width: 1440px) {
    font-size: 0.78rem;
  }

  @media (max-width: 1280px) {
    font-size: 0.73rem;
  }
`;

const THead = styled.thead`
  background-color: #515050;
  color: white;
`;

const TH = styled.th`
  padding: 4px 6px;
  border: 1px solid #ddd;
  text-align: left;
  overflow-wrap: anywhere;
  word-break: break-word;

  @media (max-width: 1440px) {
    padding: 3px 5px;
  }

  @media (max-width: 1280px) {
    padding: 2px 4px;
  }
`;

const TD = styled.td`
  padding: 4px 6px;
  border: 1px solid #ddd;
  text-align: left;
  vertical-align: top;
  overflow-wrap: anywhere;
  word-break: break-word;

  @media (max-width: 1440px) {
    padding: 3px 5px;
  }

  @media (max-width: 1280px) {
    padding: 2px 4px;
  }
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 16px 0;
  align-items: center;

  @media (max-width: 1440px) {
    gap: 8px;
    margin: 12px 0;
  }
`;

const ActionButton = styled.button`
  padding: 0.55rem 0.8rem;

  @media (max-width: 1440px) {
    padding: 0.45rem 0.65rem;
    font-size: 0.85rem;
  }

  @media (max-width: 1280px) {
    padding: 0.4rem 0.55rem;
    font-size: 0.8rem;
  }
`;

const SearchInput = styled.input`
  min-width: 180px;
  padding: 0.55rem 0.75rem;

  @media (max-width: 1440px) {
    min-width: 150px;
    padding: 0.45rem 0.65rem;
    font-size: 0.85rem;
  }

  @media (max-width: 1280px) {
    min-width: 130px;
    padding: 0.4rem 0.55rem;
    font-size: 0.8rem;
  }
`;

const ControlRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin: 12px 0;

  @media (max-width: 1440px) {
    gap: 8px;
    margin: 10px 0;
  }
`;

const FilterPanel = styled.section`
  margin: 20px 0;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

  @media (max-width: 1440px) {
    padding: 14px;
    margin: 16px 0;
  }

  @media (max-width: 1280px) {
    padding: 12px;
    margin: 12px 0;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;

  @media (max-width: 1440px) {
    gap: 8px;
    margin-bottom: 10px;
    font-size: 0.9rem;
  }
`;

const FilterTitle = styled.h3`
  margin: 0;

  @media (max-width: 1440px) {
    font-size: 1rem;
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;

  @media (max-width: 1440px) {
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 8px;
  }

  @media (max-width: 1280px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 6px;
  }
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.9rem;
    opacity: 0.9;
  }

  input,
  select {
    width: 100%;
    box-sizing: border-box;
    padding: 0.7rem 0.85rem;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.08);
    color: inherit;
  }

  @media (max-width: 1440px) {
    gap: 4px;

    label {
      font-size: 0.8rem;
    }

    input,
    select {
      padding: 0.5rem 0.6rem;
      font-size: 0.82rem;
    }
  }

  @media (max-width: 1280px) {
    label {
      font-size: 0.75rem;
    }

    input,
    select {
      padding: 0.4rem 0.5rem;
      font-size: 0.78rem;
    }
  }
`;

const FilterActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;

  @media (max-width: 1440px) {
    gap: 8px;
    margin-top: 10px;
  }
`;

const TableWrap = styled.div`
  width: 100%;
  max-width: 100%;
`;

const MediaCell = styled(TD)`
  white-space: normal;
  max-width: 292px;
`;

const MediaList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-content: flex-start;
`;

const MediaThumb = styled.img`
  height: 104px;
  width: auto;
  max-width: 154px;
  object-fit: cover;
  cursor: pointer;

  @media (max-width: 1440px) {
    height: 70px;
    max-width: 104px;
  }

  @media (max-width: 1280px) {
    height: 56px;
    max-width: 82px;
  }
`;

const StatusIcon = styled.img`
  height: 24px;
  width: 24px;
  object-fit: contain;

  @media (max-width: 1440px) {
    height: 20px;
    width: 20px;
  }

  @media (max-width: 1280px) {
    height: 18px;
    width: 18px;
  }
`;

const ActionCell = styled(TD)`
  width: 34px;
  white-space: nowrap;
  text-align: center;
`;

const InfoButton = styled.button`
  width: 100%;
  padding: 0.2rem 0.25rem;
  font-size: 0.62rem;
  line-height: 1;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  white-space: normal;

  @media (min-width: 1600px) {
    padding: 0.25rem 0.35rem;
    font-size: 0.68rem;
  }

  @media (max-width: 1440px) {
    padding: 0.2rem 0.3rem;
    font-size: 0.64rem;
  }

  @media (max-width: 1280px) {
    padding: 0.18rem 0.28rem;
    font-size: 0.6rem;
  }
`;

const CompactTextCell = styled(TD)`
  white-space: normal;
`;

const CenterCell = styled(TD)`
  text-align: center;
  white-space: nowrap;
`;

const UsesCell = styled(TD)`
  white-space: normal;
  vertical-align: top;
`;

const UsesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
`;

const ProjectTable = () => {
  const {
    projects,
    getProjectsSimple,
    statuses,
    getStatuses,
    projectCount,
    getProjectCount,
    getFavoritedProjects,
    getProjectsBySearch,
    updateProjectInList,
    getProjectFormatted,
    postProjectFavorite,
    deleteProjectFavorite
  } = useProjects();
  const { cities, getCities } = useCities();
  const { countries, getCountries } = useCountries();
  const { metroAreas, getMetroAreas } = useMetroAreas();
  const { buildingUses, getBuildingUses } = useBuildingUses();
  const { buildingTypes, getBuildingTypes } = useBuildingTypes();

  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [selectedImageDate, setSelectedImageDate] = React.useState<
    string | null
  >(null);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null
  );
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
    maxHeightMeters: '',
    firstDate: '',
    lastDate: ''
  });
  const [filterDraft, setFilterDraft] = React.useState(filters);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [pageCount, setPageCount] = useState(1);
  const [restored, setRestored] = useState(false);

  const { user } = React.useContext(AppContext);
  const storedUser = React.useMemo(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log(savedUser);
      return savedUser;
    } catch {
      return null;
    }
  }, []);

  const resolvedUser =
    (user as unknown as { user?: { id?: number } })?.user ??
    user ??
    storedUser?.user ??
    storedUser;
  const userId =
    typeof resolvedUser?.id === 'number'
      ? resolvedUser.id
      : Number(resolvedUser?.id) || undefined;

  const isFavoritedByCurrentUser = (project: Project) => {
    if (!userId) return false;
    if (!project.favoritedByUsers?.length) return false;
    return project.favoritedByUsers.some(
      (favoritedUser) =>
        favoritedUser.id !== null && Number(favoritedUser.id) === Number(userId)
    );
  };

  const calculatePageCount = (totalCount: number, pageSize: number) => {
    return Math.ceil(totalCount / pageSize);
  };

  const formatHeightMeters = (value: number | string | null | undefined) => {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return '';
    }

    return numericValue.toFixed(1);
  };

  const handleEdit = async (projectId: number) => {
    const fullProject = await getProjectFormatted(projectId);
    console.log(fullProject);
    setSelectedProject(fullProject);
    setIsModalOpen('info');
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
  const handleSearchKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      await getProjectsBySearch(searchTerm);
      await getProjectCount(searchTerm);
    }
  };

  React.useEffect(() => {
    if (restored) {
      getProjectsSimple(serializeFilters(), sortKey, order, pageSize, 1);
      getProjectCount(serializeFilters());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restored]);
  // if (!projects || projects.length === 0) {
  //   return <p>No data available</p>;
  // }
  const goPreviousProject = async () => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex((p) => p.id === selectedProject.id);
    if (currentIndex > 0) {
      const previousProject = projects[currentIndex - 1];
      const fullProject = await getProjectFormatted(
        previousProject.id as number
      );
      setSelectedProject(fullProject);
    }
  };

  const goNextProject = async () => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex((p) => p.id === selectedProject.id);
    if (currentIndex < projects.length - 1) {
      const nextProject = projects[currentIndex + 1];
      const fullProject = await getProjectFormatted(nextProject.id as number);
      setSelectedProject(fullProject);
    }
  };
  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <Toolbar>
        <ActionButton
          onClick={() => {
            getProjectsSimple(serializeFilters(), sortKey, order, pageSize, 1);
            getProjectCount(serializeFilters());
          }}
        >
          All Projects
        </ActionButton>
        <ActionButton
          onClick={() => {
            getFavoritedProjects();
          }}
        >
          Favorited Projects
        </ActionButton>
      </Toolbar>
      <ControlRow>
        <SearchInput
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        <ActionButton
          onClick={() => {
            getProjectsBySearch(searchTerm);

            getProjectCount(searchTerm);
          }}
        >
          Search
        </ActionButton>
      </ControlRow>
      <ControlRow>
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
      </ControlRow>
      <FilterPanel>
        <FilterHeader>
          <FilterTitle>Filters</FilterTitle>
          <span style={{ opacity: 0.8 }}>
            Narrow down projects by location, type, budget, and dates
          </span>
        </FilterHeader>

        <FilterGrid>
          <FilterField>
            <label>City</label>
            <DropdownCheckbox
              options={((cities as unknown as City[]) ?? []).map((c) => c.name)}
              selected={filterDraft.city}
              onChange={(cityArr) =>
                setFilterDraft((prev) => ({ ...prev, city: cityArr }))
              }
              label="Select city"
            />
          </FilterField>

          <FilterField>
            <label>Status</label>
            <DropdownCheckbox
              options={statuses}
              selected={filterDraft.status}
              onChange={(statusArr) =>
                setFilterDraft((prev) => ({ ...prev, status: statusArr }))
              }
              label="Select status"
            />
          </FilterField>

          <FilterField>
            <label>Metro Area</label>
            <DropdownCheckbox
              options={((metroAreas as unknown as MetroArea[]) ?? []).map(
                (m) => m.name
              )}
              selected={filterDraft.metroArea}
              onChange={(metroAreaArr) =>
                setFilterDraft((prev) => ({ ...prev, metroArea: metroAreaArr }))
              }
              label="Select metro area"
            />
          </FilterField>

          <FilterField>
            <label>Country</label>
            <DropdownCheckbox
              options={((countries as unknown as Country[]) ?? []).map(
                (c) => c.name
              )}
              selected={filterDraft.country}
              onChange={(countryArr) =>
                setFilterDraft((prev) => ({ ...prev, country: countryArr }))
              }
              label="Select country"
            />
          </FilterField>

          <FilterField>
            <label>Building Type</label>
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
              label="Select building type"
            />
          </FilterField>

          <FilterField>
            <label>Building Use</label>
            <DropdownCheckbox
              options={((buildingUses as unknown as BuildingUse[]) ?? []).map(
                (b) => b.buildingUse
              )}
              selected={filterDraft.buildingUse}
              onChange={(buildingUseArr) =>
                setFilterDraft((prev) => ({
                  ...prev,
                  buildingUse: buildingUseArr
                }))
              }
              label="Select building use"
            />
          </FilterField>

          <FilterField>
            <label>Min Budget</label>
            <input
              type="number"
              placeholder="Min Budget"
              value={filterDraft.minBudget}
              onChange={(e) =>
                setFilterDraft((prev) => ({
                  ...prev,
                  minBudget: e.target.value
                }))
              }
            />
          </FilterField>

          <FilterField>
            <label>Max Budget</label>
            <input
              type="number"
              placeholder="Max Budget"
              value={filterDraft.maxBudget}
              onChange={(e) =>
                setFilterDraft((prev) => ({
                  ...prev,
                  maxBudget: e.target.value
                }))
              }
            />
          </FilterField>

          <FilterField>
            <label>Min Height (m)</label>
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
          </FilterField>

          <FilterField>
            <label>Max Height (m)</label>
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
          </FilterField>

          <FilterField>
            <label>First Expected Date</label>
            <input
              type="date"
              value={filterDraft.firstDate}
              onChange={(e) =>
                setFilterDraft((prev) => ({
                  ...prev,
                  firstDate: e.target.value
                }))
              }
            />
          </FilterField>

          <FilterField>
            <label>Last Expected Date</label>
            <input
              type="date"
              value={filterDraft.lastDate}
              onChange={(e) =>
                setFilterDraft((prev) => ({
                  ...prev,
                  lastDate: e.target.value
                }))
              }
            />
          </FilterField>
        </FilterGrid>

        <FilterActions>
          <ActionButton
            onClick={() => {
              setPage(1);
              setFilters(filterDraft);
              localStorage.setItem(
                'projectTableState',
                JSON.stringify({
                  filters: filterDraft,
                  sortKey,
                  order,
                  pageSize
                })
              );
            }}
          >
            Set Filters
          </ActionButton>
          <ActionButton
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
                maxHeightMeters: '',
                firstDate: '',
                lastDate: ''
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
                maxHeightMeters: '',
                firstDate: '',
                lastDate: ''
              });
              localStorage.removeItem('projectTableState');
            }}
          >
            Clear Filters
          </ActionButton>
        </FilterActions>
      </FilterPanel>
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
      <div style={{ margin: '16px 0' }}>
        Total projects with these filters: {projectCount}
      </div>
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
      <TableWrap>
        <Table>
          <THead>
            <tr>
              <TH style={{ width: 30 }}>Chk</TH>
              <TH style={{ width: 34 }}>Fav</TH>
              <TH style={{ width: 42 }}>ID</TH>
              <TH style={{ width: 138 }}>Name</TH>
              <TH style={{ width: 78 }}>City</TH>
              <TH style={{ width: 78 }}>Country</TH>
              <TH style={{ width: 78 }}>Status</TH>
              <TH style={{ width: 72 }}>Type</TH>
              <TH style={{ width: 96 }}>Uses</TH>
              <TH style={{ width: 42 }}>m</TH>
              <TH style={{ width: 32 }}>Floors</TH>
              <TH style={{ width: 88 }}>Expected</TH>
              <TH style={{ width: 292 }}>Images</TH>
              <TH style={{ width: 20 }}>Info</TH>
            </tr>
          </THead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                {project.checkedBy ? (
                  <CenterCell>
                    <StatusIcon src={checkedIcon} alt="Checked" />
                  </CenterCell>
                ) : (
                  <CenterCell></CenterCell>
                )}
                {isFavoritedByCurrentUser(project) ? (
                  <CenterCell>
                    <button
                      onClick={() => {
                        deleteProjectFavorite(project.id as number);
                        updateProjectInList({
                          ...project,
                          favoritedByUsers: (
                            project.favoritedByUsers || []
                          ).filter((u) => u.id !== userId)
                        });
                      }}
                    >
                      <StatusIcon src={favoritedIcon} alt="Favorited" />
                    </button>
                  </CenterCell>
                ) : (
                  <CenterCell>
                    <button
                      onClick={() => {
                        postProjectFavorite(project.id as number);
                        updateProjectInList({
                          ...project,
                          favoritedByUsers: [
                            ...(project.favoritedByUsers || []),
                            { id: userId, username: '' }
                          ]
                        });
                      }}
                    >
                      <StatusIcon src={unfavoritedIcon} alt="Not Favorited" />
                    </button>
                  </CenterCell>
                )}

                <CenterCell>{project.id}</CenterCell>
                <CompactTextCell title={project.name}>
                  {project.name}
                </CompactTextCell>
                <CompactTextCell title={project.city as string}>
                  {project.city as string}
                </CompactTextCell>
                <CompactTextCell title={project.country as string}>
                  {project.country as string}
                </CompactTextCell>
                <CompactTextCell title={project.status ?? ''}>
                  {project.status}
                </CompactTextCell>
                <CompactTextCell title={project.buildingType ?? ''}>
                  {project.buildingType}
                </CompactTextCell>
                <UsesCell>
                  <UsesList>
                    {(project.buildingUses as BuildingUse[] | undefined)?.map(
                      (use) => (
                        <span key={use.id as number} title={use.buildingUse}>
                          {use.buildingUse}
                        </span>
                      )
                    )}
                  </UsesList>
                </UsesCell>
                <CenterCell>
                  {formatHeightMeters(project.buildingHeightMeters ?? null)}
                </CenterCell>
                <CenterCell>{project.buildingHeightFloors}</CenterCell>
                <CompactTextCell title={project.expectedDateText ?? ''}>
                  {project.expectedDateText}
                </CompactTextCell>

                <MediaCell>
                  <MediaList>
                    {project.media?.map((media) => (
                      <MediaThumb
                        key={media.id}
                        src={media.url}
                        alt="Project"
                        onClick={() => {
                          setSelectedImage(media.url);
                          setSelectedImageDate(
                            (media.mediaDate as string | undefined) || null
                          );
                          setIsModalOpen('image');
                        }}
                      />
                    ))}
                  </MediaList>
                </MediaCell>
                <ActionCell>
                  <InfoButton
                    onClick={() => {
                      handleEdit(project.id as number);
                    }}
                  >
                    <span>More</span>
                    <span>Info</span>
                  </InfoButton>
                </ActionCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
      {isModalOpen === 'image' && selectedImage && (
        <ProjectImageModal
          imageUrl={selectedImage}
          mediaDate={selectedImageDate ?? undefined}
          onClose={() => setIsModalOpen(null)}
        />
      )}
      {isModalOpen === 'info' && selectedProject !== null && (
        <ProjectInfoModal
          selectedProject={selectedProject}
          onClose={() => setIsModalOpen(null)}
          metroAreas={metroAreas as unknown as MetroArea[] | []}
          userId={userId}
          onProjectUpdate={(updatedProject) => {
            updateProjectInList(updatedProject);
            setSelectedProject((prev) =>
              prev ? { ...prev, ...updatedProject } : updatedProject
            );
          }}
          goPrevious={goPreviousProject}
          goNext={goNextProject}
        />
      )}
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
    </div>
  );
};

export default ProjectTable;
