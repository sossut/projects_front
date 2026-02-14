import type { Contractor } from './Contractor';
import type { Project } from './Project';

export interface ProjectContractor {
  projectId: number | Project;
  contractorId: number | Contractor;
  source: string;
}
