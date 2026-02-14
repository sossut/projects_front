import type { Consultant } from './Consultant';
import type { Country } from './Country';

export interface ConsultantsPresence {
  consultantId: number | Consultant;
  countryId: number | Country;
}
