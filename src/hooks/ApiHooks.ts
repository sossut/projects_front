import { useState } from 'react';
import type { Project } from '../interfaces/Project';
import type { MetroArea } from '../interfaces/MetroArea';

const baseUrl = 'http://localhost:5000/api/v1';
const fetchJson = async (url: string, options = {}) => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      const message = json.message;
      throw new Error(message);
    }
  } catch (e) {
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

  const getProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Bearer ${localStorage.getItem('token') || ''}`);
      console.log('getProjects');
      const data = await fetchJson(`${baseUrl}/projects`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
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
      console.log(`Bearer ${localStorage.getItem('token') || ''}`);
      console.log('getProjectsSimple');
      const response = await fetchJson(
        `${baseUrl}/projects/simple?${filters}${sortBy ? `&sortBy=${sortBy}` : ''}${order ? `&order=${order}` : ''}${limit ? `&limit=${limit}` : ''}${page ? `&page=${page}` : ''}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
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
    return {
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
      media: project.media
    };
  };

  const updateProjectInList = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === updatedProject.id
          ? { ...p, ...extractSummaryFields(updatedProject) }
          : p
      )
    );
  };

  const getProjectSimpleById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`getProjectSimpleById: ${id}`);
      const data = await fetchJson(`${baseUrl}/projects/simple/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
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
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
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

  const getStatuses = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('getStatuses');
      const data = await fetchJson(`${baseUrl}/projects/statuses`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
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
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
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
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
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

  const updateProject = async (
    id: number,
    token: string,
    updatedData: Partial<Project>
  ) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`updateProject: ${id}`, updatedData);
      const response = await fetchJson(`${baseUrl}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
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

  return {
    projects,
    loading,
    error,
    statuses,
    projectCount,
    getProjects,
    getProjectsSimple,
    getProjectCount,
    getProject,
    getProjectSimpleById,
    updateProjectInList,
    getStatuses,
    getProjectFormatted,
    updateProject
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
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
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
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
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
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
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
  const [countries, setCountries] = useState<string[]>([]);
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
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
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
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
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
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
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
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
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
    updateMetroArea
  };
};

const useEnrichment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    try {
      console.log(`startEnrichmentForProject: ${projectId}`);
      const response = await fetchJson(
        `${baseUrl}/enrichment/enrich/${projectId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
          }
        }
      );
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
    loading,
    error,
    startProjectSearch,
    startEnrichmentForProject
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
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
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
