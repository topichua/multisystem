import { FC } from 'react';

import { CommunityMeetingShare } from 'src/pages/admin-pages/admin-community/admin-community-meetings/admin-community-meetings.tsx';

export enum MEETING_VISIBILITY {
  PUBLIC = 1,
  COMMUNITY = 2,
  PRIVATE = 3,
}

export type BodyComponentProps = {
  setActiveStep: (value: InnerModal) => void;
  handleCancel: () => void;
  meeting: CommunityMeetingShare | null;
  communityId: string;
  communityAlias: string;
  setNotificationSend: () => void;
  isNotificationSend: boolean;
  setPublished: () => void;
  isPublished: boolean;
};

export type InnerModal = {
  title: string;
  body: FC<BodyComponentProps>;
  hasPrevStep?: boolean;
};
