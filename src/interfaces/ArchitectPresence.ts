import type { Architect } from './Architect';
import type { Country } from './Country';

export interface ArchitectsPresence {
  architectId: number | Architect;
  countryId: number | Country;
}
