import {
  NewsCategoryMappingDTO,
  NewsDTO,
  NewsSubcategoryMappingDTO,
  UserCreatedDTO,
} from 'src/transport/news/news.dto';
import { ResourceDTO } from 'src/transport/resources/resources.dto';
import {
  ResourceFileDeepsDTO,
  ResourceTagsMappingDeepDTO,
} from './resources.types';

export interface CategoriesDeepsDTO
  extends Omit<NewsCategoryMappingDTO, 'category_id'> {
  categoryId: {
    label: string;
    id: string;
  };
}

export interface NewsDeepDTO extends Omit<NewsDTO, 'image' | 'assets'> {
  categories?: CategoriesDeepsDTO[];
  subcategories?: NewsSubcategoryMappingDTO[];
  tags?: ResourceTagsMappingDeepDTO[];
  image?: ResourceDTO;
  userCreated?: UserCreatedDTO;
  assets?: ResourceFileDeepsDTO[];
}
