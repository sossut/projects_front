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
  max-width: 100%;
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

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 16px 0;
  align-items: center;
`;

const ActionButton = styled.button`
  padding: 0.7rem 1rem;
`;

const SearchInput = styled.input`
  min-width: 240px;
  padding: 0.7rem 0.9rem;
`;

const ControlRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin: 12px 0;
`;

const FilterPanel = styled.section`
  margin: 20px 0;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
`;

const FilterTitle = styled.h3`
  margin: 0;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
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
`;

const FilterActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
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
    <div style={{ maxWidth: '100%' }}>
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
      <Table>
        <THead>
          <tr>
            <TH>Checked</TH>
            <TH>Favorited</TH>
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
              {project.checkedBy ? (
                <TD>
                  <img height={'64px'} src={checkedIcon} alt="Checked" />
                </TD>
              ) : (
                <TD></TD>
              )}
              {isFavoritedByCurrentUser(project) ? (
                <TD>
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
                    <img height={'64px'} src={favoritedIcon} alt="Favorited" />
                  </button>
                </TD>
              ) : (
                <TD>
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
                    <img
                      height={'64px'}
                      src={unfavoritedIcon}
                      alt="Not Favorited"
                    />
                  </button>
                </TD>
              )}

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

              <TD style={{ display: 'flex', maxWidth: 500, flexWrap: 'wrap' }}>
                {project.media?.map((media) => (
                  <img
                    key={media.id}
                    src={media.url}
                    alt="Project"
                    style={{
                      height: 100,
                      marginRight: 5,
                      marginBottom: 5,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setSelectedImage(media.url);
                      setSelectedImageDate(
                        (media.mediaDate as string | undefined) || null
                      );
                      setIsModalOpen('image');
                    }}
                  />
                ))}
              </TD>
              <TD>
                <button
                  onClick={() => {
                    handleEdit(project.id as number);
                  }}
                >
                  More Info
                </button>
              </TD>
            </tr>
          ))}
        </tbody>
      </Table>
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
