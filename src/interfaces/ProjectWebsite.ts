import type { Project } from './Project';

export interface ProjectWebsite {
  id: number;
  url: string;
  projectId: number | Project;
}
