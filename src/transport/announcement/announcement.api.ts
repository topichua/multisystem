import axio2s from '../axios/axios-instance';

import { PaginationParams, PaginationResponse } from '../types';
import {
  Announcement,
  CreateAnnouncementDto,
  EditAnnouncementDto,
} from './announcement.dto';

const now = Date.now();
const RELEVANT_ANNOUNCEMENT: Announcement = {
  id: 'mock-announcement-id',
  title: 'Platform maintenance this weekend',
  description:
    'Scheduled maintenance will take place on Saturday 2:00–6:00 AM UTC. The platform may be briefly unavailable.',
  link: undefined,
  isActive: true,
  startDate: new Date(now),
  endDate: new Date(now + 7 * 24 * 60 * 60 * 1000),
  createdAt: new Date(now),
  updatedAt: new Date(now),
  updatedByUserId: 'mock-user-id',
  createdByUserId: 'mock-user-id',
  cancelledViewByUserIds: [],
  segmentIds: [],
};

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  RELEVANT_ANNOUNCEMENT,
  {
    id: 'announcement-2',
    title: 'New security policy effective next week',
    description: 'Please review the updated policy in the shared drive and complete acknowledgment by Friday.',
    isActive: true,
    startDate: new Date(now - 86400_000),
    endDate: new Date(now + 14 * 86400_000),
    createdAt: new Date(now - 86400_000),
    updatedAt: new Date(now - 43200_000),
    updatedByUserId: 'mock-user-id',
    createdByUserId: 'mock-user-id',
    cancelledViewByUserIds: [],
    segmentIds: [],
  },
  {
    id: 'announcement-3',
    title: 'VPN and MFA rollout reminder',
    description: 'Phase 2 rollout continues. Check your email for your scheduled window and setup guide.',
    isActive: true,
    startDate: new Date(now - 2 * 86400_000),
    endDate: new Date(now + 30 * 86400_000),
    createdAt: new Date(now - 2 * 86400_000),
    updatedAt: new Date(now - 86400_000),
    updatedByUserId: 'mock-user-id',
    createdByUserId: 'mock-user-id',
    cancelledViewByUserIds: [],
    segmentIds: [],
  },
];

export const announcementApi = {
  async fetchAnnouncements({
    page = 1,
    pageSize = 1000,
  }: PaginationParams): Promise<
    PaginationResponse<{ announcements: Announcement[] }>
  > {
    const start = (page - 1) * pageSize;
    const announcements = MOCK_ANNOUNCEMENTS.slice(start, start + pageSize);
    return Promise.resolve({
      announcements,
      args: { page, pageSize },
      totalItemCount: MOCK_ANNOUNCEMENTS.length,
    });
    // return await axio2s.get(
    //   `api/v1/admin/announcements?page=${page}&pageSize=${pageSize}`
    // );
  },

  async createAnnouncement(data: CreateAnnouncementDto) {
    return await axio2s.post('api/v1/admin/announcements', data);
  },

  async editAnnouncement({ id, ...restData }: EditAnnouncementDto) {
    return await axio2s.put(`api/v1/admin/announcements/${id}`, restData);
  },

  async deleteAnnouncement(id: string) {
    return await axio2s.delete(`api/v1/admin/announcements/${id}`);
  },

  async getRelevantAnnouncement(): Promise<Announcement> {
    return Promise.resolve(RELEVANT_ANNOUNCEMENT);
    // return await axio2s.get(`api/v1/announcements`);
  },

  async cancelAnnouncement(id: string) {
    return await axio2s.put(`api/v1/announcements/${id}/cancelled`);
  },
};
