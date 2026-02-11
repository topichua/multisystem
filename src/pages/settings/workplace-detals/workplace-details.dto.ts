type Field = {
  id: string;
  label: string;
  value: {};
  toolTip: string;
  type: string;
  isRequired: string;
};

type Organisation = {
  id: string;
  name: string;
  address1: string;
  address2: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  website: string;
  imageUrl: string;
  fields: Field[];
};

type Data = {
  organisation: Organisation;
  role: string;
  rank: string;
  startDate: string;
};

export type WorkplaceDetailsDto = {
  data: Data;
  message: string;
};

export type InterestsDataResponse = {
  data: Record<string, string>;
  message: string | null;
};

type AreaOfInterest = {
  segmentId: string;
  segmentName: string;
};

export type UserInterestsDataResponse = {
  data: AreaOfInterest[];
  message: string | null;
};
