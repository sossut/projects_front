export interface ProjectFirstPass {
  id?: number;
  name: string;
  address: string;
  metroArea: string;
  city: string;
  country: string;
  continent: string;
  buildingHeightMeters?: number | null;
  buildingType: string;
  buildingUse: string[];
  status: string;
  expectedDateText: string;
  lastVerifiedDate: Date;
  sources: {
    publisher: string;
    url: string;
  }[];
}
