import type { Country } from './Country';
import type { Developer } from './Developer';

export interface DevelopersPresence {
  developerId: number | Developer;
  countryId: number | Country;
}
