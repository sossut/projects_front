import type { Contractor } from './Contractor';
import type { Country } from './Country';

export interface ContractorsPresence {
  contractorId: number | Contractor;
  countryId: number | Country;
}
