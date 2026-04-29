// ...existing code...
import React, { useState } from 'react';
import styled from 'styled-components';

import {
  useProjects,
  useCities,
  useCountries,
  useMetroAreas,
  useBuildingUses,
  useBuildingTypes,
  useEnrichment
} from '../hooks/ApiHooks';
import type { BuildingUse } from '../interfaces/BuildingUse';
import ProjectInfoModal from './ProjectInfoModal';
import ProjectImageModal from './ProjectImageModal';
import EnrichmentConfirmationModal from './EnrichmentConfirmationModal';
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
  padding: 0.45rem 0.7rem;
  font-size: 0.9rem;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 6px 14px rgba(59, 130, 246, 0.18);
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.22);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 1440px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.85rem;
  }

  @media (max-width: 1280px) {
    padding: 0.35rem 0.5rem;
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
  width: 60px;
  white-space: nowrap;
  text-align: center;
  padding: 0;
  vertical-align: stretch;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 8px 0;
`;

const InfoButton = styled.button`
  flex: 1;
  min-width: 45px;
  padding: 0.3rem 0.2rem;
  font-size: 0.6rem;
  line-height: 1;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  white-space: normal;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
    transform: translateY(-1px);
  }

  @media (min-width: 1600px) {
    padding: 0.35rem 0.25rem;
    font-size: 0.65rem;
  }

  @media (max-width: 1440px) {
    padding: 0.3rem 0.2rem;
    font-size: 0.58rem;
  }

  @media (max-width: 1280px) {
    padding: 0.25rem 0.15rem;
    font-size: 0.55rem;
  }
`;

const EnrichButton = styled(InfoButton)<{ isLoading?: boolean }>`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
  }

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const CompactTextCell = styled(TD)`
  white-space: normal;
`;

const TopActionButton = styled(ActionButton)`
  padding: 10px 14px;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 10px;
`;

const ExportButton = styled(TopActionButton)`
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 55%, #0ea5a4 100%);
  color: #ffffff;
  box-shadow: 0 6px 14px rgba(59, 130, 246, 0.28);
`;

const TopActionBar = styled.div`
  position: fixed;
  top: 92px;
  right: 16px;
  z-index: 1100;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const RefreshButton = styled(TopActionButton)`
  background: linear-gradient(135deg, #10b981 0%, #22c55e 52%, #0ea5a4 100%);
  box-shadow: 0 6px 14px rgba(16, 185, 129, 0.28);
`;

const PaginationButton = styled(ActionButton)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
  padding: 0.35rem 0.6rem;
  font-weight: 700;
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 12px 0;
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
    deleteProjectFavorite,
    exportProjectsExcel
  } = useProjects();
  const { cities, getCities } = useCities();
  const { countries, getCountries } = useCountries();
  const { metroAreas, getMetroAreas } = useMetroAreas();
  const { buildingUses, getBuildingUses } = useBuildingUses();
  const { buildingTypes, getBuildingTypes } = useBuildingTypes();
  const {
    startEnrichmentForProject,
    waitForEnrichmentJobTerminalStatus,
    clearEnrichmentInFlight
  } = useEnrichment();

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
  const [enrichmentModalOpen, setEnrichmentModalOpen] = React.useState(false);
  const [projectToEnrich, setProjectToEnrich] = React.useState<Project | null>(
    null
  );
  const [enrichmentLoading, setEnrichmentLoading] = React.useState(false);

  const { user, enrichingProjectId, setEnrichingProjectId } =
    React.useContext(AppContext);
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

  const handleEnrichClick = (project: Project) => {
    setProjectToEnrich(project);
    setEnrichmentModalOpen(true);
  };

  const handleEnrichmentConfirm = async () => {
    if (!projectToEnrich?.id) return;

    setEnrichmentLoading(true);
    try {
      const projectId = projectToEnrich.id as number;
      setEnrichingProjectId(projectId);
      console.log(
        `Starting enrichment for project: ${projectToEnrich?.name} (ID: ${projectId})`
      );
      const job = await startEnrichmentForProject(projectId);
      console.log('Enrichment job started:', job);
      const jobId =
        (job as { jobId?: number | string; id?: number | string } | undefined)
          ?.jobId ??
        (job as { jobId?: number | string; id?: number | string } | undefined)
          ?.id;

      if (!jobId) {
        alert('Could not start enrichment: missing job id');
        setEnrichmentModalOpen(false);
        setEnrichingProjectId(null);
        return;
      }

      setEnrichmentModalOpen(false);
      alert(
        `Enrichment job started, job ID: ${jobId} for project ${projectToEnrich?.name}`
      );

      const result = await waitForEnrichmentJobTerminalStatus(
        jobId,
        10000,
        25 * 60 * 1000
      );
      const refreshedProject = await getProjectFormatted(projectId);
      if (refreshedProject) {
        updateProjectInList(refreshedProject);
      }

      if (result.status === 'completed') {
        alert(`Enrichment completed for ${projectToEnrich.name}`);
      } else {
        alert(`Enrichment failed for ${projectToEnrich.name}`);
      }
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Failed to start enrichment';
      alert(message);
      console.error('Enrichment flow failed:', e);
    } finally {
      if (projectToEnrich?.id) {
        clearEnrichmentInFlight(projectToEnrich.id as number);
        setEnrichingProjectId(null);
      }
      setEnrichmentLoading(false);
    }
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

  const syncFilters = (nextFilters: typeof filters) => {
    setFilterDraft(nextFilters);
    setFilters(nextFilters);
    setPage(1);
    localStorage.setItem(
      'projectTableState',
      JSON.stringify({
        filters: nextFilters,
        sortKey,
        order,
        pageSize
      })
    );
  };

  const countryList = React.useMemo(
    () => (countries as unknown as Country[]) ?? [],
    [countries]
  );
  const metroAreaList = React.useMemo(
    () => (metroAreas as unknown as MetroArea[]) ?? [],
    [metroAreas]
  );
  const cityList = React.useMemo(
    () => (cities as unknown as City[]) ?? [],
    [cities]
  );

  const countryNameById = React.useMemo(() => {
    const countryMap = new Map<number, string>();
    countryList.forEach((country) => {
      countryMap.set(Number(country.id), country.name);
    });
    return countryMap;
  }, [countryList]);

  const getMetroAreaCountryName = React.useCallback(
    (metroArea: MetroArea) => {
      return (
        metroArea.country?.name ||
        metroArea.countryName ||
        countryNameById.get(Number(metroArea.countryId)) ||
        ''
      );
    },
    [countryNameById]
  );

  const getMetroOptionsForCountries = React.useCallback(
    (selectedCountries: string[]) => {
      if (selectedCountries.length === 0) {
        return metroAreaList.map((metroArea) => metroArea.name);
      }

      const selectedCountrySet = new Set(
        selectedCountries.map((countryName) => countryName.toLowerCase())
      );

      return metroAreaList
        .filter((metroArea) =>
          selectedCountrySet.has(
            getMetroAreaCountryName(metroArea).toLowerCase()
          )
        )
        .map((metroArea) => metroArea.name);
    },
    [metroAreaList, getMetroAreaCountryName]
  );

  const metroAreaNameById = React.useMemo(() => {
    const metroMap = new Map<number, string>();
    metroAreaList.forEach((metroArea) => {
      metroMap.set(Number(metroArea.id), metroArea.name);
    });
    return metroMap;
  }, [metroAreaList]);

  const getCityMetroAreaName = React.useCallback(
    (city: City) => {
      if (typeof city.metroAreaId === 'object' && city.metroAreaId !== null) {
        return city.metroAreaId.name;
      }
      return metroAreaNameById.get(Number(city.metroAreaId)) || '';
    },
    [metroAreaNameById]
  );

  const getCityOptionsForMetros = React.useCallback(
    (selectedMetros: string[], selectedCountries: string[]) => {
      if (selectedMetros.length > 0) {
        const selectedMetroSet = new Set(
          selectedMetros.map((metroName) => metroName.toLowerCase())
        );

        return cityList
          .filter((city) =>
            selectedMetroSet.has(getCityMetroAreaName(city).toLowerCase())
          )
          .map((city) => city.name);
      }

      if (selectedCountries.length > 0) {
        const selectedCountrySet = new Set(
          selectedCountries.map((countryName) => countryName.toLowerCase())
        );

        return cityList
          .filter((city) => {
            const metroAreaName = getCityMetroAreaName(city);
            const metroArea = metroAreaList.find(
              (metro) => metro.name === metroAreaName
            );
            if (!metroArea) {
              return false;
            }
            return selectedCountrySet.has(
              getMetroAreaCountryName(metroArea).toLowerCase()
            );
          })
          .map((city) => city.name);
      }

      return cityList.map((city) => city.name);
    },
    [cityList, getCityMetroAreaName, metroAreaList, getMetroAreaCountryName]
  );

  const filteredMetroAreaOptions = React.useMemo(
    () => getMetroOptionsForCountries(filterDraft.country),
    [filterDraft.country, getMetroOptionsForCountries]
  );

  const filteredCityOptions = React.useMemo(
    () => getCityOptionsForMetros(filterDraft.metroArea, filterDraft.country),
    [filterDraft.metroArea, filterDraft.country, getCityOptionsForMetros]
  );

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
      <TopActionBar>
        <ExportButton
          onClick={async () => {
            await exportProjectsExcel(serializeFilters(), sortKey, order);
          }}
        >
          Export Data
        </ExportButton>
        <RefreshButton
          onClick={() => {
            getProjectsSimple(
              serializeFilters(),
              sortKey,
              order,
              pageSize,
              page
            );
            getProjectCount(serializeFilters());
          }}
        >
          Refresh
        </RefreshButton>
      </TopActionBar>
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
        <select
          value={sortKey}
          onChange={(e) => {
            const nextSortKey = e.target.value;
            setSortKey(nextSortKey);
            localStorage.setItem(
              'projectTableState',
              JSON.stringify({
                filters,
                sortKey: nextSortKey,
                order,
                pageSize
              })
            );
          }}
        >
          <option value="id">ID</option>
          <option value="name">Name</option>
          <option value="city">City</option>
          <option value="expectedDate">Date</option>
          <option value="buildingHeightMeters">Height (m)</option>
          <option value="buildingHeightFloors">Height (floors)</option>
          <option value="lastVerifiedDate">Last verified date</option>
        </select>
        <label>Order:</label>
        <select
          value={order}
          onChange={(e) => {
            const nextOrder = e.target.value as 'asc' | 'desc';
            setOrder(nextOrder);
            localStorage.setItem(
              'projectTableState',
              JSON.stringify({
                filters,
                sortKey,
                order: nextOrder,
                pageSize
              })
            );
          }}
        >
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
            <label>Country</label>
            <DropdownCheckbox
              options={countryList.map((c) => c.name)}
              selected={filterDraft.country}
              onChange={(countryArr) => {
                const allowedMetroAreas = new Set(
                  getMetroOptionsForCountries(countryArr)
                );
                const prunedMetroAreas = filterDraft.metroArea.filter((metro) =>
                  allowedMetroAreas.has(metro)
                );
                const allowedCities = new Set(
                  getCityOptionsForMetros(prunedMetroAreas, countryArr)
                );
                const prunedCities = filterDraft.city.filter((cityName) =>
                  allowedCities.has(cityName)
                );

                syncFilters({
                  ...filterDraft,
                  country: countryArr,
                  metroArea: prunedMetroAreas,
                  city: prunedCities
                });
              }}
              label="Select country"
            />
          </FilterField>

          <FilterField>
            <label>Metro Area</label>
            <DropdownCheckbox
              options={filteredMetroAreaOptions}
              selected={filterDraft.metroArea}
              onChange={(metroAreaArr) => {
                const allowedCities = new Set(
                  getCityOptionsForMetros(metroAreaArr, filterDraft.country)
                );
                const prunedCities = filterDraft.city.filter((cityName) =>
                  allowedCities.has(cityName)
                );

                syncFilters({
                  ...filterDraft,
                  metroArea: metroAreaArr,
                  city: prunedCities
                });
              }}
              label="Select metro area"
            />
          </FilterField>

          <FilterField>
            <label>City</label>
            <DropdownCheckbox
              options={filteredCityOptions}
              selected={filterDraft.city}
              onChange={(cityArr) =>
                syncFilters({ ...filterDraft, city: cityArr })
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
                syncFilters({ ...filterDraft, status: statusArr })
              }
              label="Select status"
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
                syncFilters({ ...filterDraft, buildingType: buildingTypeArr })
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
                syncFilters({ ...filterDraft, buildingUse: buildingUseArr })
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
                syncFilters({ ...filterDraft, minBudget: e.target.value })
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
                syncFilters({ ...filterDraft, maxBudget: e.target.value })
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
                syncFilters({ ...filterDraft, minHeightMeters: e.target.value })
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
                syncFilters({ ...filterDraft, maxHeightMeters: e.target.value })
              }
            />
          </FilterField>

          <FilterField>
            <label>First Expected Date</label>
            <input
              type="date"
              value={filterDraft.firstDate}
              onChange={(e) =>
                syncFilters({ ...filterDraft, firstDate: e.target.value })
              }
            />
          </FilterField>

          <FilterField>
            <label>Last Expected Date</label>
            <input
              type="date"
              value={filterDraft.lastDate}
              onChange={(e) =>
                syncFilters({ ...filterDraft, lastDate: e.target.value })
              }
            />
          </FilterField>
        </FilterGrid>

        <FilterActions>
          <ActionButton
            onClick={() => {
              const clearedFilters = {
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
              };
              syncFilters(clearedFilters);
            }}
          >
            Clear Filters
          </ActionButton>
        </FilterActions>
      </FilterPanel>
      <PaginationContainer>
        <PaginationButton
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
        </PaginationButton>
        <span>
          Page {page} of {pageCount}
        </span>
        <PaginationButton
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
        </PaginationButton>
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
      </PaginationContainer>
      <div style={{ margin: '16px 0' }}>
        Total projects with these filters: {projectCount}
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
              <TH style={{ width: 82 }}>Status</TH>
              <TH style={{ width: 72 }}>Type</TH>
              <TH style={{ width: 96 }}>Uses</TH>
              <TH style={{ width: 42 }}>m</TH>
              <TH style={{ width: 32 }}>Floors</TH>
              <TH style={{ width: 88 }}>Expected</TH>
              <TH style={{ width: 292 }}>Images</TH>
              <TH style={{ width: 60 }}>Actions</TH>
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
                  <ActionButtonsContainer>
                    <InfoButton
                      onClick={() => {
                        handleEdit(project.id as number);
                      }}
                    >
                      <span>More</span>
                      <span>Info</span>
                    </InfoButton>
                    <EnrichButton
                      onClick={() => {
                        handleEnrichClick(project);
                      }}
                      disabled={enrichingProjectId === project.id}
                    >
                      {enrichingProjectId === project.id ? (
                        <>
                          <Spinner />
                          <span>Enriching...</span>
                        </>
                      ) : (
                        <span>Enrich</span>
                      )}
                    </EnrichButton>
                  </ActionButtonsContainer>
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
      {enrichmentModalOpen && projectToEnrich && (
        <EnrichmentConfirmationModal
          projectName={projectToEnrich.name || 'Unknown Project'}
          onConfirm={handleEnrichmentConfirm}
          onCancel={() => {
            setEnrichmentModalOpen(false);
            setProjectToEnrich(null);
          }}
          isLoading={enrichmentLoading}
        />
      )}
    </div>
  );
};

export default ProjectTable;
