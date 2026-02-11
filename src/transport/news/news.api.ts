import { axiosDirectusInstance } from '../axios/axios-instance-directus';
import {
  GetItemsParams,
  GetSingleItemParams,
  NewsCategoryDTO,
  NewsCategoryMappingDTO,
  NewsDTO,
  NewsListResponse,
  NewsSubcategoryDTO,
  NewsSubcategoryMappingDTO,
  NewsTagsDTO,
  NewsTagsMappingDTO,
} from './news.dto';
import axio2s from 'src/transport/axios/axios-instance.ts';
import { PaginationResponse } from 'src/transport/types.ts';

export const newsApi = {
  getNewsList<T = NewsDTO>(
    params?: GetItemsParams
  ): Promise<NewsListResponse<T>> {
    return axiosDirectusInstance.get('items/news', {
      params,
    });
  },
  getNewsDetails(
    id: string,
    params?: GetSingleItemParams
  ): Promise<{ data: NewsDTO }> {
    return axiosDirectusInstance.get(`items/news/${id}`, { params });
  },
  getNewsByIds(ids: string[]): Promise<NewsListResponse<NewsDTO>> {
    const idFilter = ids.join(',');
    return axiosDirectusInstance.get(`items/news`, {
      params: {
        'filter[id][_in]': idFilter,
        fields: '*.*,segments',
      },
    });
  },
  getNewsTags(params?: GetItemsParams): Promise<{ data: NewsTagsDTO[] }> {
    return axiosDirectusInstance.get('items/tag', { params });
  },
  getNewsTag(id: string, params?: GetSingleItemParams): Promise<NewsTagsDTO> {
    return axiosDirectusInstance.get(`items/tag/${id}`, { params });
  },
  getNewsTagsMapping(params?: GetItemsParams): Promise<NewsTagsMappingDTO> {
    return axiosDirectusInstance.get(`items/tag_mapping`, { params });
  },
  getNewsTagsMappingById(
    id: string,
    params?: GetSingleItemParams
  ): Promise<{ data: NewsTagsMappingDTO }> {
    return axiosDirectusInstance.get(`items/tags_mapping/${id}`, {
      params,
    });
  },
  getNewsCategories(
    params?: GetItemsParams
  ): Promise<{ data: NewsCategoryDTO[] }> {
    return axiosDirectusInstance.get('items/category', { params });
  },
  getNewsCategoryById(
    id: string,
    params?: GetSingleItemParams
  ): Promise<{ data: NewsCategoryDTO }> {
    return axiosDirectusInstance.get(`items/category/${id}`, { params });
  },
  getNewsCategoryMappingList(
    params?: GetItemsParams
  ): Promise<NewsCategoryMappingDTO[]> {
    return axiosDirectusInstance.get('items/category_mapping', { params });
  },
  getNewsCategoryMappingById(
    id: string,
    params?: GetSingleItemParams
  ): Promise<NewsCategoryMappingDTO> {
    return axiosDirectusInstance.get(`items/category_mapping/${id}`, {
      params,
    });
  },
  getNewsSubcategories(params?: GetItemsParams): Promise<NewsSubcategoryDTO[]> {
    return axiosDirectusInstance.get('items/subcategory', { params });
  },
  getNewsSubcategoryById(
    id: string,
    params?: GetSingleItemParams
  ): Promise<NewsSubcategoryDTO> {
    return axiosDirectusInstance.get(`items/subcategory/${id}`, {
      params,
    });
  },
  getNewsSubcategoryMappingList(
    params?: GetItemsParams
  ): Promise<NewsSubcategoryMappingDTO[]> {
    return axiosDirectusInstance.get('items/subcategory_mapping', {
      params,
    });
  },
  getNewsSubcategoryMappingById(
    id: string,
    params?: GetSingleItemParams
  ): Promise<NewsSubcategoryMappingDTO> {
    return axiosDirectusInstance.get(`items/subcategory_mapping/${id}`, {
      params,
    });
  },

  async getFavoriteNewsIds(
    page: number = 1,
    pageSize = 1000
  ): Promise<PaginationResponse<{ favoriteNewsIds: Array<string> }>> {
    return await axio2s.get(
      `api/v1/news/favorite?page=${page}&pageSize=${pageSize}`
    );
  },

  async addNewsToFavorite(newsId: string) {
    return await axio2s.post(`api/v1/news/${newsId}/add-to-favorite`);
  },

  async removeNewsFromFavorite(newsId: string) {
    return await axio2s.post(`api/v1/news/${newsId}/delete-from-favorite`);
  },
};
