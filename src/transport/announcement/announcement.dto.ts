export type Announcement = {
  id: string;
  title: string;
  description: string;
  link?: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  updatedByUserId: string;
  createdByUserId: string;
  cancelledViewByUserIds: string[];
  segmentIds: string[];
};

export type CreateAnnouncementDto = {
  title: string;
  description: string;
  link?: string;
  startDate: string;
  endDate: string;
};

export type EditAnnouncementDto = Partial<CreateAnnouncementDto> & {
  id: string;
  isActive?: boolean;
};
