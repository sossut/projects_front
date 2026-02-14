import type { BuildingUse } from './BuildingUse';
import type { Project } from './Project';

export interface ProjectBuildingUse {
  projectId: number | Project;
  buildingUseId: number | BuildingUse;
}
