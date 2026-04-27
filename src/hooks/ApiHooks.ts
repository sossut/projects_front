import { useState } from 'react';
import type { Project } from '../interfaces/Project';
import type { MetroArea } from '../interfaces/MetroArea';
import type { Country } from '../interfaces/Country';

const baseUrl =
  'https://essentials-housing-transaction-ecommerce.trycloudflare.com/api/v1';
const getAuthToken = () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    return storedUser?.token || storedUser?.user?.token || '';
  } catch {
    return '';
  }
};

const token = {
  toString: () => getAuthToken(),
  valueOf: () => getAuthToken(),
  [Symbol.toPrimitive]: () => getAuthToken()
} as unknown as string;

const activeEnrichmentProjects = new Set<number>();

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const fetchJson = async (url: string, options = {}) => {
  try {
    const response = await fetch(url, options);
    const text = await response.text();
    const json = text ? JSON.parse(text) : null;
    if (response.ok) {
      return json;
    } else {
      const message =
        (json as { message?: string } | null)?.message ||
        `Request failed with status ${response.status}`;
      throw new ApiError(message, response.status);
    }
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    }
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw e;
    }
  }
};

const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [projectCount, setProjectCount] = useState<number>(0);
  const [projectNames, setProjectNames] = useState<string[]>([]);

  const getProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Bearer ${token}`);
      console.log('getProjects');
      const data = await fetchJson(`${baseUrl}/projects`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setProjects(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  const getProjectsSimple = async (
    filters?: string,
    sortBy?: string,
    order?: string,
    limit?: number,
    page?: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Bearer ${token}`);
      console.log('getProjectsSimple');
      const response = await fetchJson(
        `${baseUrl}/projects/simple?${filters}${sortBy ? `&sortBy=${sortBy}` : ''}${order ? `&order=${order}` : ''}${limit ? `&limit=${limit}` : ''}${page ? `&page=${page}` : ''}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      setProjects(response);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const extractSummaryFields = (project: Project) => {
    const fields: Partial<Project> & { checkedByUser?: number } = {
      id: project.id,
      name: project.name,
      status: project.status,
      budgetEur: project.budgetEur,
      buildingHeightMeters: project.buildingHeightMeters,
      buildingHeightFloors: project.buildingHeightFloors,
      glassFacade: project.glassFacade,
      facadeBasis: project.facadeBasis,
      buildingType: project.buildingType,
      buildingUse: project.buildingUse,
      country: project.country,
      city: project.city,
      expectedDate: project.expectedDate,
      lastVerifiedDate: project.lastVerifiedDate,
      media: project.media,
      favoritedByUsers: project.favoritedByUsers,
      checkedAt: project.checkedAt,
      checkedByUser: project.checkedBy as number,
      checkedBy: project.checkedBy,
      checkedByUsername: project.checkedByUsername
    };
    return Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    );
  };

  const exportProjectsExcel = async (
    filters?: string,
    sortBy?: string,
    order?: string
  ) => {
    try {
      const response = await fetch(
        `${baseUrl}/projects/simple/export/excel?${filters ?? ''}${sortBy ? `&sortBy=${encodeURIComponent(sortBy)}` : ''}${order ? `&order=${encodeURIComponent(order)}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new ApiError(
          message || `Request failed with status ${response.status}`,
          response.status
        );
      }

      const blob = await response.blob();
      const contentDisposition =
        response.headers.get('content-disposition') || '';
      const fileNameMatch = contentDisposition.match(
        /filename\*?=(?:UTF-8''|\")?([^\";]+)/i
      );
      const fileName = fileNameMatch?.[1]
        ? decodeURIComponent(fileNameMatch[1].replace(/\"/g, '').trim())
        : 'projects-export.xlsx';

      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const updateProjectInList = (updatedProject: Project) => {
    const updatedId = updatedProject.id;
    if (updatedId === undefined || updatedId === null) {
      return;
    }

    const updatedIdAsNumber = Number(updatedId);
    const hasNumericId = Number.isFinite(updatedIdAsNumber);

    setProjects((prev) =>
      prev.map((p) => {
        const currentId = p.id;
        if (currentId === undefined || currentId === null) {
          return p;
        }

        const currentIdAsNumber = Number(currentId);
        const isSameProject = hasNumericId
          ? Number.isFinite(currentIdAsNumber) &&
            currentIdAsNumber === updatedIdAsNumber
          : String(currentId) === String(updatedId);

        return isSameProject
          ? { ...p, ...extractSummaryFields(updatedProject) }
          : p;
      })
    );
  };

  const getFavoritedProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('getFavoritedProjects');
      const data = await fetchJson(`${baseUrl}/projects/favorites`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setProjects(data);
      setProjectCount(data.length);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const getProjectSimpleById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`getProjectSimpleById: ${id}`);
      const data = await fetchJson(`${baseUrl}/projects/simple/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const getProjectCount = async (filters?: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('getProjectCount');
      const response = await fetchJson(`${baseUrl}/projects/count?${filters}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      console.log(`${baseUrl}/projects/count?${filters}`);
      setProjectCount(response.count);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const getProjectNamesByMetroAreaAndBuildingType = async (
    metroAreaId: number,
    buildingTypeId: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      console.log(
        `getProjectNamesByMetroAreaAndBuildingType: metroAreaId=${metroAreaId}, buildingTypeId=${buildingTypeId}`
      );
      const data = await fetchJson(
        `${baseUrl}/projects/metro/${metroAreaId}/building-type/${buildingTypeId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      setProjectNames(data);
      return data;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const getProjectNamesByCountry = async (countryId: number) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`getProjectNamesByCountry: countryId=${countryId}`);
      const data = await fetchJson(`${baseUrl}/projects/country/${countryId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setProjectNames(data);
      return data;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const getProjectsBySearch = async (search: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`getProjectsBySearch: ${search}`);
      const data = await fetchJson(
        `${baseUrl}/projects/search?q=${encodeURIComponent(search)}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('ihme');
      if (
        !data ||
        data.length === 0 ||
        (Array.isArray(data) && data[0] === null)
      ) {
        console.log('nolla');
        setProjectCount(0);
        setProjects([]);
        return [];
      }
      setProjects(data);
      setProjectCount(data.length);
      return data;
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        setProjectCount(0);
        setProjects([]);
        setError(null);
        return [];
      }
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const postProjectFavorite = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`postProjectFavorite: ${id}`);
      await fetchJson(`${baseUrl}/projects/${id}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteProjectFavorite = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`deleteProjectFavorite: ${id}`);
      await fetchJson(`${baseUrl}/projects/${id}/favorite`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatuses = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('getStatuses');
      const data = await fetchJson(`${baseUrl}/projects/statuses`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setStatuses(data);
      return data;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const getProject = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`getProjectById: ${id}`);
      const data = await fetchJson(`${baseUrl}/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const getProjectFormatted = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`getProjectFormattedById: ${id}`);
      const data = await fetchJson(`${baseUrl}/projects/formatted/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const getProjectsCoordinates = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('getProjectsCoordinates');
      const data = await fetchJson(`${baseUrl}/projects/coordinates`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setProjects(data);
      return data;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id: number, updatedData: Partial<Project>) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`updateProject: ${id}`, updatedData);
      const response = await fetchJson(`${baseUrl}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      return response;
      // Optionally update local state here if needed
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProjectNoId = async (updatedData: Partial<Project>) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`updateProjectNoId`, updatedData);
      const response = await fetchJson(`${baseUrl}/projects/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      return response;
      // Optionally update local state here if needed
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const addProjects = async (projects: Partial<Project>[]) => {
    setLoading(true);
    setError(null);
    try {
      console.log(projects);
      console.log(`addProjects`, projects);
      const response = await fetchJson(`${baseUrl}/projects/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(projects)
      });
      return response;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`deleteProject: ${id}`);
      await fetchJson(`${baseUrl}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    error,
    statuses,
    projectCount,
    projectNames,
    getProjects,
    getProjectsSimple,
    exportProjectsExcel,
    getProjectCount,
    getProject,
    getProjectNamesByMetroAreaAndBuildingType,
    getProjectNamesByCountry,
    getProjectsBySearch,
    getProjectSimpleById,
    getProjectsCoordinates,
    getFavoritedProjects,
    updateProjectInList,
    postProjectFavorite,
    deleteProjectFavorite,
    getStatuses,
    getProjectFormatted,
    updateProject,
    updateProjectNoId,
    addProjects,
    deleteProject
  };
};

const useBuildingUses = () => {
  const [buildingUses, setBuildingUses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBuildingUses = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('getBuildingUses');
      const data = await fetchJson(`${baseUrl}/building-uses`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setBuildingUses(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    buildingUses,
    loading,
    error,
    getBuildingUses
  };
};

const useBuildingTypes = () => {
  const [buildingTypes, setBuildingTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getBuildingTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('getBuildingTypes');
      const data = await fetchJson(`${baseUrl}/building-types`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setBuildingTypes(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    buildingTypes,
    loading,
    error,
    getBuildingTypes
  };
};

const useCities = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getCities = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('getCities');
      const data = await fetchJson(`${baseUrl}/cities`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setCities(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    cities,
    loading,
    error,
    getCities
  };
};

const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('getCountries');
      const data = await fetchJson(`${baseUrl}/countries`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setCountries(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    countries,
    loading,
    error,
    getCountries
  };
};

const useMetroAreas = () => {
  const [metroAreas, setMetroAreas] = useState<MetroArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getMetroAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('getMetroAreas');
      const data = await fetchJson(`${baseUrl}/metro-areas`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setMetroAreas(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const getMetroArea = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`getMetroArea: ${id}`);
      const data = await fetchJson(`${baseUrl}/metro-areas/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const addMetroArea = async (name: string, countryId: number) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`addMetroArea: ${name}`);
      const response = await fetchJson(`${baseUrl}/metro-areas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, countryId })
      });
      return response;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateMetroArea = async (
    id: number,
    updatedData: Partial<{ name: string; doAutomation: boolean }>
  ) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`updateMetroArea: ${id}`, updatedData);
      const response = await fetchJson(`${baseUrl}/metro-areas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      return response;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    metroAreas,
    loading,
    error,
    setMetroAreas,
    getMetroAreas,
    getMetroArea,
    addMetroArea,
    updateMetroArea
  };
};

const useEnrichment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearEnrichmentInFlight = (projectId: number) => {
    activeEnrichmentProjects.delete(projectId);
  };

  const normalizeEnrichmentJobStatus = (status: unknown) => {
    if (typeof status !== 'string') {
      return 'unknown';
    }

    const normalized = status.toLowerCase();
    if (normalized === 'complete') {
      return 'completed';
    }

    return normalized;
  };

  const getEnrichmentJobStatus = async (jobId: number | string) => {
    return fetchJson(`${baseUrl}/enrichment/job/${jobId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
  };

  const waitForEnrichmentJobTerminalStatus = async (
    jobId: number | string,
    intervalMs = 5000,
    timeoutMs = 15 * 60 * 1000
  ) => {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
      const response = await getEnrichmentJobStatus(jobId);
      const status = normalizeEnrichmentJobStatus(
        (response as { status?: unknown; jobStatus?: unknown; state?: unknown })
          ?.status ??
          (
            response as {
              status?: unknown;
              jobStatus?: unknown;
              state?: unknown;
            }
          )?.jobStatus ??
          (
            response as {
              status?: unknown;
              jobStatus?: unknown;
              state?: unknown;
            }
          )?.state
      );

      if (status === 'completed' || status === 'failed') {
        return { status, response };
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error('Timed out while waiting for enrichment to finish');
  };

  const startProjectSearch = async (
    buildingTypes: string[],
    location: string,
    country: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`startProjectSearch: ${buildingTypes.join(', ')}`);
      await fetchJson(`${baseUrl}/enrichment/find-projects/gpt5/queue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ buildingTypes, location, country })
      });
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const startEnrichmentForProject = async (projectId: number) => {
    setLoading(true);
    setError(null);
    if (projectId === 0) {
      setError('Invalid project ID');
      setLoading(false);
      return;
    }

    if (activeEnrichmentProjects.has(projectId)) {
      const message = `Enrichment is already running for project ${projectId}`;
      setError(message);
      setLoading(false);
      throw new Error(message);
    }

    activeEnrichmentProjects.add(projectId);

    try {
      console.log(`startEnrichmentForProject: ${projectId}`);
      const response = await fetchJson(
        `${baseUrl}/enrichment/enrich/${projectId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response;
    } catch (e) {
      clearEnrichmentInFlight(projectId);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    startProjectSearch,
    startEnrichmentForProject,
    waitForEnrichmentJobTerminalStatus,
    clearEnrichmentInFlight
  };
};

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`login: ${email}`);
      const response = await fetchJson(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      return response;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        console.log(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    login
  };
};

const useQueue = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [queueInfo, setQueueInfo] = useState<any>(null);
  const getQueueInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('getQueueInfo');
      const data = await fetchJson(`${baseUrl}/queue-info`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        }
      });
      setQueueInfo(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getQueueInfo,
    queueInfo
  };
};

export {
  useProjects,
  useBuildingUses,
  useBuildingTypes,
  useCities,
  useCountries,
  useMetroAreas,
  useEnrichment,
  useLogin,
  useQueue
};
