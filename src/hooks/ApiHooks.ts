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
  const getProjectsSimple = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('getProjectsSimple');
      const response = await fetchJson(`${baseUrl}/projects/simple`);
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

  return {
    projects,
    loading,
    error,
    getProjects,
    getProjectsSimple,
    getProject
  };
};

export { useProjects };
