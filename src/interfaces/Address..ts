import type { Point } from 'geojson';
import type { City } from './City';
import type { Country } from './Country';
export interface Address {
  id?: number;
  address: string;
  location?: Point | null;
  postcode?: string | null;
  cityId?: number | City;
  city?: City;
  country: Country;
}
