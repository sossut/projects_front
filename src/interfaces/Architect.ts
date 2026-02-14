import type { Continent } from './Continent';
import type { Country } from './Country';

export interface Architect {
  id?: number;
  name: string;
  website?: string;
  hqCountryId?: number | Country | null;
  hqCountry?: string | Country | null;
  hqContinent?: string | Continent | null;
  email?: string;
  phone?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
  source?: string;
}
