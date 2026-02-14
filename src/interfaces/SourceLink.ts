import type { Project } from './Project';

export interface SourceLink {
  id: number;
  url: string;
  projectId: number | Project;
  sourceType:
    | 'developer'
    | 'architect'
    | 'planning'
    | 'database'
    | 'media'
    | 'other';
  publisher: string;
  accessedAt: Date;
}
