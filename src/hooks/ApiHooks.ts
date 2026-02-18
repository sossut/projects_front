import { useState } from 'react';
import type { Project } from '../interfaces/Project';

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
      console.log('getProjects');
      const data = await fetchJson(`${baseUrl}/projects`);
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
      console.log('getProjectsSimple');
      const response = await fetchJson(
        `${baseUrl}/projects/simple?${filters}${sortBy ? `&sortBy=${sortBy}` : ''}${order ? `&order=${order}` : ''}${limit ? `&limit=${limit}` : ''}${page ? `&page=${page}` : ''}`
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

  const getProjectCount = async (filters?: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('getProjectCount');
      const response = await fetchJson(`${baseUrl}/projects/count?${filters}`);
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
      const data = await fetchJson(`${baseUrl}/projects/statuses`);
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
      const data = await fetchJson(`${baseUrl}/projects/${id}`);
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
      const data = await fetchJson(`${baseUrl}/projects/formatted/${id}`);
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
          'Content-Type': 'application/json'
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
      const data = await fetchJson(`${baseUrl}/building-uses`);
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
      const data = await fetchJson(`${baseUrl}/building-types`);
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
      const data = await fetchJson(`${baseUrl}/cities`);
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
      const data = await fetchJson(`${baseUrl}/countries`);
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
  const [metroAreas, setMetroAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getMetroAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('getMetroAreas');
      const data = await fetchJson(`${baseUrl}/metro-areas`);
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

  return {
    metroAreas,
    loading,
    error,
    getMetroAreas
  };
};

export {
  useProjects,
  useBuildingUses,
  useBuildingTypes,
  useCities,
  useCountries,
  useMetroAreas
};
