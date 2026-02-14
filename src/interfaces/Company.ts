import type { Architect } from './Architect';
import type { Consultant } from './Consultant';
import type { Contractor } from './Contractor';
import type { Country } from './Country';
import type { Developer } from './Developer';

export interface Company {
  countrySearched: Country;
  results: {
    developers: Developer[];
    architects: Architect[];
    contractors: Contractor[];
    consultants: Consultant[];
  };
}
