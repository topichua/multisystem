import { getAuthorizationHeader } from '../axios/axios-bond-instance';
import { axiosDirectusInstance } from '../axios/axios-instance-directus';
import { GetSingleItemParams as _GetSingleItemParams } from '../news/news.dto';
import {
  GetItemsParams,
  GetSingleItemParams,
  ResourceCategoryDTO,
  ResourceCategoryMappingDTO,
  ResourceDTO,
  ResourceFilesDTO,
  ResourceSegmentDTO,
  ResourceSegmentMappingDTO,
  ResourcesListResponse,
  ResourceSubcategoryDTO,
  ResourceSubcategoryMappingDTO,
  ResourceTagDTO,
  ResourceTagMappingDTO,
} from './resources.dto';
import axios from 'src/transport/axios/axios-instance.ts';
import { PaginationResponse } from 'src/transport/types.ts';

export const resourceApi = {
  getResourceList<T = ResourceDTO>(
    params?: GetItemsParams
  ): Promise<ResourcesListResponse<T>> {
    return axiosDirectusInstance.get('items/resource', {
      params,
    });
  },

  getResourceDetails(
    id: string,
    params?: _GetSingleItemParams
  ): Promise<{ data: ResourceDTO }> {
    return axiosDirectusInstance.get(`items/resource/${id}`, { params });
  },

  getResourcesByIds(ids: string[]): Promise<{ data: ResourceDTO[] }> {
    const idFilter = ids.join(',');
    return axiosDirectusInstance.get(`items/resource`, {
      params: {
        'filter[id][_in]': idFilter,
        fields: '*.*,segments',
      },
    });
  },

  getResourceCategories(
    params?: GetItemsParams
  ): Promise<{ data: ResourceCategoryDTO[] }> {
    // return axiosDirectusInstance.get('items/category', { params }); // previous value
    return axios.get(
      import.meta.env.VITE_API_BOND_URL + '/api/tag/subcategories',
      {
        headers: {
          Authorization: getAuthorizationHeader(),
        },
        params,
      }
    );
  },

  getResourceCategoryById(
    id: string,
    params?: _GetSingleItemParams
  ): Promise<{ data: ResourceCategoryDTO }> {
    // return axiosDirectusInstance.get(`items/category/${id}`, { // previous value
    return axiosDirectusInstance.get(`items/subcategory/${id}`, {
      params,
    });
  },

  getResourceCategoryMappingList(
    params?: GetItemsParams
  ): Promise<{ data: ResourceCategoryMappingDTO[] }> {
    return axiosDirectusInstance.get('items/category_mapping', {
      params,
    });
  },

  getResourceCategoryMappingById(
    id: number,
    params?: GetSingleItemParams
  ): Promise<{ data: ResourceCategoryMappingDTO }> {
    return axiosDirectusInstance.get(`items/category_mapping/${id}`, {
      params,
    });
  },

  getResourceTags(
    params?: GetItemsParams
  ): Promise<{ data: ResourceTagDTO[] }> {
    return axiosDirectusInstance.get('items/tag', { params });
  },

  getResourceTagById(
    id: number,
    params?: GetSingleItemParams
  ): Promise<{ data: ResourceTagDTO }> {
    return axiosDirectusInstance.get(`items/tag/${id}`, { params });
  },

  getResourceTagMappingList(
    params?: GetItemsParams
  ): Promise<{ data: ResourceTagMappingDTO[] }> {
    return axiosDirectusInstance.get(`items/tag_mapping`, { params });
  },

  getResourceTagMappingById(
    id: number,
    params?: GetSingleItemParams
  ): Promise<{ data: ResourceTagMappingDTO }> {
    return axiosDirectusInstance.get(`items/tag_mapping/${id}`, {
      params,
    });
  },

  getResourceSubcategories(
    params?: GetItemsParams
  ): Promise<{ data: ResourceSubcategoryDTO[] }> {
    return axiosDirectusInstance.get('items/subcategory', { params });
  },

  getResourceSubcategoryById(
    id: string,
    params?: GetSingleItemParams
  ): Promise<{ data: ResourceSubcategoryDTO }> {
    return axiosDirectusInstance.get(`items/subcategory/${id}`, {
      params,
    });
  },

  getResourceSubcategoryMappingList(
    params?: GetItemsParams
  ): Promise<{ data: ResourceSubcategoryMappingDTO[] }> {
    return axiosDirectusInstance.get('items/subcategory_mapping', {
      params,
    });
  },

  getResourceSubcategoryMappingById(
    id: number,
    params?: GetSingleItemParams
  ): Promise<{ data: ResourceSubcategoryMappingDTO }> {
    return axiosDirectusInstance.get(`items/subcategory_mapping/${id}`, {
      params,
    });
  },

  getResourceFilesList(
    params?: GetItemsParams
  ): Promise<{ data: ResourceFilesDTO[] }> {
    return axiosDirectusInstance.get('items/files', { params });
  },

  getResourceFilesById(
    id: number,
    params?: GetSingleItemParams
  ): Promise<{ data: ResourceFilesDTO }> {
    return axiosDirectusInstance.get(`items/files/${id}`, { params });
  },

  getResourceSegments(
    params?: GetItemsParams
  ): Promise<{ data: ResourceSegmentDTO[] }> {
    return axiosDirectusInstance.get('items/segment', { params });
  },

  getResourceSegmentById(
    id: string,
    params?: GetSingleItemParams
  ): Promise<{ data: ResourceSegmentDTO }> {
    return axiosDirectusInstance.get(`items/segment/${id}`, { params });
  },

  getResourceSegmentMappingList(
    params?: GetItemsParams
  ): Promise<{ data: ResourceSegmentMappingDTO[] }> {
    return axiosDirectusInstance.get('items/segment_mapping', {
      params,
    });
  },

  getResourceSegmentMappingById(
    id: number,
    params?: GetSingleItemParams
  ): Promise<{ data: ResourceSegmentMappingDTO }> {
    return axiosDirectusInstance.get(`items/segment_mapping/${id}`, {
      params,
    });
  },

  async getFavoriteResourceIds(
    page: number = 1,
    pageSize = 1000
  ): Promise<PaginationResponse<{ favoriteResourcesIds: Array<string> }>> {
    return await axios.get(
      `api/v1/resource/favorite?page=${page}&pageSize=${pageSize}`
    );
  },

  async addResourceToFavorite(resourceId: string) {
    return await axios.post(`api/v1/resource/${resourceId}/add-to-favorite`);
  },

  async removeResourceFromFavorite(resourceId: string) {
    return await axios.post(
      `api/v1/resource/${resourceId}/delete-from-favorite`
    );
  },
};
