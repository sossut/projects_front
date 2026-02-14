import type { Project } from './Project';

export interface ProjectMedia {
  id?: number;
  url: string;
  projectId: number | Project;
  title: string;
  filename?: string;
  sourcePage?: string | null;
  mediaType?: string | null;
}
