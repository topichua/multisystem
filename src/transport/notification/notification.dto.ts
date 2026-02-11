import { PostLabelEnum, PostReportTypeEnum } from '../posts/posts.dto';

export interface NotificationResponse {
  notifications: NotificationActivityListItemModelDTO[];
  totalItemCount: number;
  args: {
    communityId: string | null;
    isRead: boolean;
    page: number;
    pageSize: number;
  };
}

export interface NotificationActivityListItemModelDTO {
  id: string;
  activityType: NotificationActivityType;
  readAt: string | null;
  createdAt: string;
  initiatorUser: NotificationInitiatorDtoModel;
  community?: NotificationCommunityDtoModel;
  comment?: NotificationCommentDtoModel;
  post?: NotificationPostDtoModel;
  commentTotalLikes?: number | null;
  postTotalViews?: number;
  postTotalCommentsCount?: number;
  postNotificationStatus?: boolean | null;
  asset?: NotificationAssetsDtoModel;
  meet?: NotificationMeetDtoModel;
  member?: NotificationMemberDtoModel;
}

export enum NotificationActivityType {
  NewOpenCommunityCreated = 1,
  NewPostWasCreated = 2,
  YourPostWasApproved = 3,
  YourPostWasCommented = 4,
  PostWasUpdated = 5,
  NewPostWasShared = 6,
  NewActionRequestToPost = 7,
  NewActionRequestToComment = 8,
  PostInYourGroupWasCommented = 9,
  NewActionResolutionToPost = 10,
  NewActionResolutionToComment = 11,
  NewAssetWasCreated = 12,
  NewMeetWasCreated = 13,
  NewAddedMember = 14,
  NewBlockedMember = 15,
  NewAwaitingMember = 16,
}

export interface NotificationDtoModel {
  id: string;
  activityType: NotificationActivityType;
  readAt: string | null;
  createdAt: string;
  initiatorUser: NotificationInitiatorDtoModel;
  receiverUserId: string;
  community?: NotificationCommunityDtoModel;
  comment?: NotificationCommentDtoModel;
  post?: NotificationPostDtoModel;
}

export interface NotificationPostDtoModel {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  label?: PostLabelEnum;
  reports: NotificationPostReportDtoModel[];
  tags: Array<{ name: string; id: string }>;
  secondaryCommunities: NotificationCommunityDtoModel[];
  creatorFirstName?: string;
  creatorLastName?: string;
}

export interface NotificationPostReportDtoModel {
  userId: string;
  type: PostReportTypeEnum;
  message?: string;
  insertedAt: string;
}

export interface NotificationCommentReportDtoModel {
  userId: string;
  insertedAt: string;
  message?: string;
}

export interface NotificationCommentDtoModel {
  id: string;
  body?: string;
  createdAt: string;
  reports: NotificationCommentReportDtoModel[];
  createdByUserId?: string;
  creatorFirstName?: string;
  creatorLastName?: string;
  parentCommentId?: string | null;
}

export interface NotificationCommunityDtoModel {
  id: string;
  name?: string;
}

export interface NotificationInitiatorDtoModel {
  id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface NotificationAssetsDtoModel {
  id: string;
  communityId: string;
  createdAt?: string;
  createdByUserId?: string;
  creatorFirstName?: string;
  creatorLastName?: string;
  creatorFullName?: string;
  name: string;
  path?: string;
  type?: number;
}

interface NotificationMeetDtoModel {
  communityId: string;
  createdAt: string;
  createdByUserId: string;
  creatorFirstName: string;
  creatorFullName: string;
  creatorLastName: string;
  id: string;
  name: string;
}

interface NotificationMemberDtoModel {
  communityId: string;
  createdAt: string;
  creatorFirstName: string;
  creatorFullName: string;
  creatorLastName: string;
  id: string;
  memberFirstName: string;
  memberFullName: string;
  memberLastName: string;
  status: number;
  userId: string;
}
