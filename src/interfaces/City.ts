import type { MetroArea } from './MetroArea';

export interface City {
  id?: number;
  name: string;
  metroAreaId: number | MetroArea;
}
