import {
  FilesDTO,
  NewsTagsDTO,
  UserCreatedDTO,
} from 'src/transport/news/news.dto';
import {
  AssetId,
  ResourceCategoryMappingDTO,
  ResourceDTO,
  ResourceFilesDTO,
  ResourceSubcategoryMappingDTO,
  ResourceTagMappingDTO,
} from 'src/transport/resources/resources.dto';

export interface ResourceTagsMappingDeepDTO extends ResourceTagMappingDTO {
  tagId?: NewsTagsDTO;
}

export interface ResourceFileDeepsDTO extends ResourceFilesDTO {
  assetId: AssetId;
}

export interface CategoriesDeepsDTO
  extends Omit<ResourceCategoryMappingDTO, 'category_id'> {
  categoryId: {
    label: string;
    id: string;
  };
}

export interface ResourceDeepDTO
  extends Omit<ResourceDTO, 'assets' | 'categories'> {
  categories?: CategoriesDeepsDTO[];
  subcategories?: ResourceSubcategoryMappingDTO[];
  tags?: ResourceTagsMappingDeepDTO[];
  image?: FilesDTO;
  userCreated?: UserCreatedDTO;
  assets?: ResourceFileDeepsDTO[];
}
