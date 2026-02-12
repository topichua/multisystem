import axio2s from '../axios/axios-instance';
import { PaginationParams, PaginationResponse } from '../types';
import { PostTag } from './communities.dto';

const MOCK_TAG_NAMES = [
  'Incident',
  'Policy',
  'Update',
  'Security',
  'Compliance',
  'How-to',
  'Announcement',
  'Threat intel',
  'Access control',
  'Training',
  'Runbook',
  'Post-mortem',
  'Vulnerability',
  'IAM',
  'Phishing',
  'MFA',
  'VPN',
  'Audit',
  'Risk',
  'Governance',
];

const now = 1735689600000; // 2025-01-01
const buildMockTags = (): PostTag[] =>
  MOCK_TAG_NAMES.map((name, idx) => {
    const i = idx + 1;
    return {
      id: `tag-${i}`,
      name,
      countOfPosts: (i * 3) % 50 + 1,
      createdByUserId: `user-${(i % 7) + 1}`,
      updatedByUserId: `user-${(i % 7) + 1}`,
      createdAt: new Date(now - i * 86400_000),
      updatedAt: new Date(now - (i - 1) * 43200_000),
    };
  });

const allMockTags = buildMockTags();

export const communityTagsApi = {
  async getTags({
    page = 1,
    pageSize = 100,
  }: PaginationParams): Promise<PaginationResponse<{ tags: PostTag[] }>> {
    const start = (page - 1) * pageSize;
    const tags = allMockTags.slice(start, start + pageSize);
    return Promise.resolve({
      tags,
      args: { page, pageSize },
      totalItemCount: allMockTags.length,
    });
    // return axio2s.get(`api/v1/community/post/tag?page=${page}&pageSize=${pageSize}`);
  },

  async getTagsCommon({
    page = 1,
    pageSize = 100,
  }: PaginationParams): Promise<PaginationResponse<{ tags: PostTag[] }>> {
    const start = (page - 1) * pageSize;
    const tags = allMockTags.slice(start, start + pageSize);
    return Promise.resolve({
      tags,
      args: { page, pageSize },
      totalItemCount: allMockTags.length,
    });
    // return axio2s.get(`api/v1/community/post/tag?page=${page}&pageSize=${pageSize}`);
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
