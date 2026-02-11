import { FilesDTO } from '../news/news.dto';

export interface ResourceDTO {
  id: string;
  user_created?: string;
  date_created?: string;
  user_updated?: string;
  dateUpdated?: string;
  name?: string;
  url?: string;
  membersOnly?: boolean;
  publishStartDate?: string;
  publishEndDate?: string;
  shortDescription?: string;
  image?: string | FilesDTO;
  private?: boolean;
  archiveDate?: string;
  status: string;
  seo?: string;
  content?: string;
  categories?: number[] | ResourceCategoryMappingDTO[];
  tags?: number[] | ResourceTagMappingDTO[];
  subcategories?: number[] | ResourceSubcategoryMappingDTO[];
  assets?: number[] | ResourceFilesDTO[];
  segments?: number[] | ResourceSegmentMappingDTO[];
}

export interface ResourceCategoryDTO {
  id: number;
  name?: string;
  subcategories?: string[] | ResourceSubcategoryDTO[];
}

export interface ResourceCategoryMappingDTO {
  id: number;
  resource_id?: string | ResourceDTO;
  category_id?: number | ResourceCategoryDTO;
}

export interface ResourceTagDTO {
  id: number;
  name?: string;
}

export interface ResourceTagMappingDTO {
  id: number;
  resource_id?: string | ResourceDTO;
  resource_tag_id?: number | ResourceTagDTO;
}

export interface ResourceSubcategoryDTO {
  id: string;
  name?: string;
  resource_category_id?: number | ResourceCategoryDTO;
}

export interface ResourceSubcategoryMappingDTO {
  id: number;
  resource_id?: string | ResourceDTO;
  resource_subcategory_id?: string | ResourceSubcategoryDTO;
}

export interface ResourceFilesDTO {
  id: number;
  resourceId?: string | ResourceDTO;
  assetId?: string | AssetId;
}

export interface ResourceSegmentDTO {
  id: string;
  name?: string;
}

export interface ResourceSegmentMappingDTO {
  id: number;
  resource_id?: string | ResourceDTO;
  segment_id?: string | ResourceSegmentDTO;
}

export interface GetItemsParams {
  fields?: string;
  filter?: Record<string, unknown>;
  sort?: string[];
  limit?: number;
  offset?: number;
  page?: number;
  search?: string;
  meta?: string;
}

export interface GetSingleItemParams {
  fields?: string[];
  meta?: string;
}

export interface AssetId {
  id: string;
  name: string;
  url?: string;
  image?: Image3;
  file?: Image3;
}

export interface Image3 {
  id: string;
  storage: string;
  filenameDisk: string;
  filename_download: string;
  title: string;
  type: string;
  folder: null | string;
  uploaded_by: string;
  created_on: string;
  modified_by: null | string;
  modified_on: string;
  charset: null | string;
  filesize: string;
  width: number;
  height: number;
  duration: null | string;
  embed: null | string;
  description: null | string;
  location: null | string;
  tags: null | string;
  metadata: Metadata3;
  focal_point_x: null | string;
  focal_point_y: null | string;
  tus_id: null | string;
  tus_data: null | string;
  uploaded_on: string;
}

export interface Metadata3 {}

//response

export interface ResourcesListResponse<T = ResourceDTO> {
  data: T[];
  meta?: {
    totalCount: number;
    filterCount: number;
  };
}
