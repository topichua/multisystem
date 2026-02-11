// Common types
export type UUID = string;
export type Timestamp = string;

// Query parameters
export interface CommonQueryParams {
  fields?: string;
  filter?: Record<string, unknown>;
  search?: string;
  sort?: string[];
  limit?: number;
  offset?: number;
  page?: number;
  meta?: string;
  deep?: string;
}

// DTO models
export interface ResourceDTO {
  id: UUID;
  user_created?: UUID;
  date_created?: Timestamp;
  user_updated?: UUID;
  date_updated?: Timestamp;
  name?: string;
  url?: string;
  membersOnly?: boolean;
  publishStartDate?: string;
  publishEndDate?: string;
  shortDescription?: string;
  image?: UUID | FilesDTO;
  private?: boolean;
  archiveDate?: string;
  status: string;
  seo?: UUID;
  content?: string;
  categories?: number[] | ResourceCategoryMappingDTO[];
  tags?: number[] | ResourceTagMappingDTO[];
  subcategories?: number[] | ResourceSubcategoryMappingDTO[];
  assets?: number[] | ResourceFilesDTO[];
}
// Image3;
export interface FilesDTO {
  id: UUID;
  storage: string;
  filename_disk: string;
  filenameDownload: string;
  title: string;
  type: string;
  folder: string | null;
  uploaded_by: UUID;
  uploaded_on: string;
  modified_by?: UUID;
  modified_on: Timestamp;
  charset?: string;
  filesize: number;
  width?: number;
  height?: number;
  duration?: number;
  embed?: string;
  description?: string;
  location?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  focal_point_x?: number;
  focal_point_y?: number;
  tus_id?: string;
  tus_data?: unknown;
}

export interface ResourceCategoryMappingDTO {
  id: number;
  resource_id?: UUID | ResourceDTO;
  resource_category_id?: number | ResourceCategoryDTO;
}

export interface ResourceCategoryDTO {
  id: number;
  name?: string;
  subcategories?: UUID[] | ResourceSubcategoryDTO[];
}

export interface NewsTagsDTO {
  id: number;
  label?: string;
}

export interface NewsCategoryMappingDTO {
  id: number;
  news_id?: UUID | NewsDTO;
  category_id?: number | NewsCategoryDTO;
}

export interface ResourceTagMappingDTO {
  id: number;
  resource_id?: UUID | ResourceDTO;
  resource_tag_id?: number | ResourceTagDTO;
}

export interface ResourceTagDTO {
  id: number;
  name?: string;
}

export interface NewsDTO {
  id: UUID;
  status: string;
  userCreated?: UUID | UserCreatedDTO;
  dateCreated?: Timestamp;
  user_updated?: UUID | UserCreatedDTO;
  dateUpdated?: Timestamp;
  name?: string;
  url?: string;
  publishStartDate?: string;
  publishEndDate?: string;
  archiveDate?: string;
  membersOnly?: boolean;
  private?: boolean;
  shortDescription?: string;
  image?: UUID | FilesDTO;
  seo?: UUID;
  content?: string;
  categories?: number[] | NewsCategoryMappingDTO[];
  tags?: number[] | NewsTagsMappingDTO[];
  subcategories?: number[] | NewsSubcategoryMappingDTO[];
  images: Image2[];
}

export interface Image2 {
  directusFilesId: DirectusFilesId;
}

export interface DirectusFilesId {
  id: string;
  storage: string;
  filename_disk: string;
  filename_download: string;
  title: string;
  type: string;
  folder: string | null;
  uploaded_by: string;
  created_on: string;
  modified_by: string | null;
  modified_on: string;
  charset: string | null;
  filesize: string;
  width: number;
  height: number;
  duration: string | null;
  embed: string | null;
  description: string | null;
  location: string | null;
  tags: string[] | null;
  metadata: Metadata2;
  focal_point_x: string | null;
  focal_point_y: string | null;
  tus_id: string | null;
  tus_data: string | null;
  uploaded_on: string;
}
export interface Metadata2 {}

export interface UserCreatedDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location: string | null;
  title: string | null;
  description: string | null;
  tags: NewsTagsDTO | null;
  avatar: UUID | null;
  language: string | null;
  tfa_secret: string | null;
  status: string;
  role: string;
  pronoun: string;
  token: string | null;
  last_access: string;
  last_page: string;
  provider: string;
  external_identifier: string | null;
  auth_data: string | null;
  email_notifications: boolean;
  appearance: string | null;
  theme_dark: string | null;
  theme_light: string | null;
  theme_light_overrides: string | null;
  theme_dark_overrides: string | null;
}

export interface NewsTagsMappingDTO {
  id: number;
  news_id?: UUID | NewsDTO;
  news_tags_id?: number | NewsTagsDTO;
}

export interface NewsCategoryDTO {
  id: number;
  label?: string;
  subcategories?: UUID[] | NewsSubcategoryDTO[];
}

export interface NewsSubcategoryDTO {
  id: UUID;
  name?: string;
  news_category_id?: number | NewsCategoryDTO;
}

export interface NewsSubcategoryMappingDTO {
  id: number;
  news_id?: UUID | NewsDTO;
  news_subcategory_id?: UUID | NewsSubcategoryDTO;
}

export interface ResourceSubcategoryDTO {
  id: UUID;
  name?: string;
  resource_category_id?: number | ResourceCategoryDTO;
}

export interface ResourceSubcategoryMappingDTO {
  id: number;
  resource_id?: UUID | ResourceDTO;
  resource_subcategory_id?: UUID | ResourceSubcategoryDTO;
}

export interface ResourceFilesDTO {
  id: number;
  resource_id?: UUID | ResourceDTO;
  asset_id?: UUID | FilesDTO;
}

// Request parameters
export interface GetAssetParams {
  id: string;
  key?: string;
  transforms?: string;
  download?: boolean;
}

export interface LoginParams {
  email: string;
  password: string;
  mode?: 'json' | 'cookie' | 'session';
  otp?: string;
}

export interface RefreshTokenParams {
  refresh_token: string;
  mode?: 'json' | 'cookie' | 'session';
}

export interface LogoutParams {
  refresh_token?: string;
  mode?: 'json' | 'cookie' | 'session';
}

export interface PasswordRequestParams {
  email: string;
}

export interface PasswordResetParams {
  token: string;
  password: string;
}

export interface OAuthProviderParams {
  provider: string;
  redirect?: string;
}

export interface ServerInfoParams {
  super_admin_token: number;
}

// Extend CommonQueryParams for specific endpoints
export interface GetItemsParams extends CommonQueryParams {
  export?: 'csv' | 'json' | 'xml' | 'yaml';
}

export interface GetSingleItemParams
  extends Omit<CommonQueryParams, 'limit' | 'offset' | 'page'> {
  id: string | number;
  version?: string;
}

//response

export interface NewsListResponse<T = NewsDTO> {
  data: T[];
  meta?: {
    totalCount: number;
    filterCount: number;
  };
}
