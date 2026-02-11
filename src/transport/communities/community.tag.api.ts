import axio2s from '../axios/axios-instance';
import { PaginationParams, PaginationResponse } from '../types';
import { PostTag } from './communities.dto';

export const communityTagsApi = {
  async getTags({
    page = 1,
    pageSize = 100,
  }: PaginationParams): Promise<PaginationResponse<{ tags: PostTag[] }>> {
    return axio2s.get(
      `api/v1/community/post/tag?page=${page}&pageSize=${pageSize}`
    );
  },

  async getTagsCommon({
    page = 1,
    pageSize = 100,
  }: PaginationParams): Promise<PaginationResponse<{ tags: PostTag[] }>> {
    return axio2s.get(
      `api/v1/community/post/tag?page=${page}&pageSize=${pageSize}`
    );
  },

  async createTag({ name }: { name: string }) {
    return axio2s.post(`api/v1/admin/community/post/tag`, { name });
  },

  async editTag({ name, id }: { name: string; id: string }) {
    return axio2s.put(`api/v1/admin/community/post/tag/${id}`, { name });
  },

  async deleteTag(id: string) {
    return axio2s.delete(`api/v1/admin/community/post/tag/${id}`);
  },
};
