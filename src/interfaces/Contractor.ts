import type { Continent } from './Continent';
import type { Country } from './Country';

export interface Contractor {
  id?: number;
  name: string;
  hqCountryId?: number | Country | null;
  hqCountry?: string | Country | null;
  hqContinent?: string | Continent | null;
  website?: string;
  email?: string;
  phone?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
  source?: string;
}
