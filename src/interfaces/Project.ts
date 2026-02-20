import type { Address } from './Address.';
import type { Architect } from './Architect';
import type { BuildingUse } from './BuildingUse';
import type { BuildingType } from './BuildinType';
import type { City } from './City';
import type { Consultant } from './Consultant';
import type { Contractor } from './Contractor';
import type { Country } from './Country';
import type { Developer } from './Developer';
import type { ProjectMedia } from './ProjectMedia';
import type { ProjectWebsite } from './ProjectWebsite';
import type { SourceLink } from './SourceLink';

export interface Project {
  id?: number;
  name: string;
  addressId: number | Address;
  expectedDateText?: string | null;
  earliestDateText?: string | null;
  latestDateText?: string | null;
  expectedDate?: Date | null;
  expectedCompletionWindow?: {
    expected?: string;
    earliest?: string;
    latest?: string;
  };
  buildingHeightMeters?: number | null;
  buildingHeightFloors?: number | null;
  buildingTypeId?: number | BuildingType;
  buildingType?: string;
  buildingUse?: string[];
  buildingUses?: BuildingUse[] | string[];
  budgetEur?: number;
  glassFacade?: 'yes' | 'no' | 'unknown' | true | false | 0 | 1 | null | 'null';
  facadeBasis?: string;
  status?:
    | 'planned'
    | 'approved'
    | 'proposed'
    | 'on_hold'
    | 'under_construction'
    | 'completed'
    | 'cancelled';
  lastVerifiedDate?: Date;
  confidenceScore?: 'low' | 'medium' | 'high';
  isActive?: boolean;
  projectKey?: string; //lower(trim(name)) + "|" + lower(trim(city)) + "|" + lower(trim(country))
  location?: {
    continent: string;
    address: string;
    country: string;
    city: string;
    metroArea: string; //same as search area,
    postcode?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    location?: {
      latitude: number;
      longitude: number;
    };
  };
  projectWebsites?: ProjectWebsite[] | string[];
  developers?: Developer[];
  architects?: Architect[];
  contractors?: Contractor[];
  consultants?: Consultant[];
  projectMedias?: ProjectMedia[];
  media?: ProjectMedia[];
  sources?: SourceLink[];
  sourceLinks?: SourceLink[];
  projects?: Project[];
  address?: Address;
  country?: Country | string;
  city?: City | string;
}
