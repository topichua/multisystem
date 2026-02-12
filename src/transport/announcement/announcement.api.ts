import axio2s from '../axios/axios-instance';

import { PaginationParams, PaginationResponse } from '../types';
import {
  Announcement,
  CreateAnnouncementDto,
  EditAnnouncementDto,
} from './announcement.dto';

export const announcementApi = {
  async fetchAnnouncements({
    page = 1,
    pageSize = 1000,
  }: PaginationParams): Promise<
    PaginationResponse<{ announcements: Announcement[] }>
  > {
    return await axio2s.get(
      `api/v1/admin/announcements?page=${page}&pageSize=${pageSize}`
    );
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
    // Mock: replace with real API when backend is ready
    return Promise.resolve({
      id: 'mock-announcement-id',
      title: 'Platform maintenance this weekend',
      description:
        'Scheduled maintenance will take place on Saturday 2:00–6:00 AM UTC. The platform may be briefly unavailable.',
      link: undefined,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedByUserId: 'mock-user-id',
      createdByUserId: 'mock-user-id',
      cancelledViewByUserIds: [],
      segmentIds: [],
    });
    // return await axio2s.get(`api/v1/announcements`);
  },

  async cancelAnnouncement(id: string) {
    return await axio2s.put(`api/v1/announcements/${id}/cancelled`);
  },
};
