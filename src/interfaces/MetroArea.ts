import type { Country } from './Country';

export interface MetroArea {
  id: number;
  name: string;
  countryId: number;
  lastSearchedAt?: Date;
  country?: Country;
}
