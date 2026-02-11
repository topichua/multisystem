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
    return await axio2s.get(`api/v1/announcements`);
  },

  async cancelAnnouncement(id: string) {
    return await axio2s.put(`api/v1/announcements/${id}/cancelled`);
  },
};
