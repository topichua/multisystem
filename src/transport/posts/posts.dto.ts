import { UploadFile } from 'antd';

import { CommunitiyDto } from '../communities/communities.dto';
import { UserProfileDto } from '../account/account.dto';
import { PaginationParams } from '../types';
import { UploadAttachment } from 'src/components/common/UploadAttachments/UploadAttachments';

export type Post = {
  id: string;
  communityId: string;
  community?: CommunitiyDto;
  title: string;
  body: string;
  createdAt: Date;
  status: PostStatus;
  tags?: Pick<PostTag, 'id' | 'name'>[];
  updatedAt: Date;
  createdByUserId: string;
  isFrozen: boolean;
  attachments?: Attachment[];
  user?: UserProfileDto;
  reports?: Report[];
  imageUrl?: string;
  likesCount?: number;
  viewsCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
};

export type Attachment = {
  path: string;
  name: string;
  type: string;
};

export type PostTag = {
  id: string;
  name: string;
  countOfPosts: number;
  createdByUserId: string;
  updatedByUserId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePostDto = {
  communityId: string;
  title: string;
  body: string;
  files?: UploadAttachment[];
  imageFile?: UploadFile;
};

export type EditPostDto = Partial<Omit<CreatePostDto, 'communityId'>> & {
  id: string;
  isFrozen?: boolean;
};

export type Comment = {
  id: string;
  body: string;
  parentCommentId: string | null;
  createdByUserId: string;
  user?: UserProfileDto;
  createdAt: Date;
  updatedAt: Date;
  postId: string;
  likesCount: number;
  isLiked?: boolean;
  comments?: Comment[];
  reports: Report[];
  attachments?: Attachment[];
};

export type Report = {
  id: string;
  userId: string;
  user?: UserProfileDto;
  reason: string;
  createdAt: Date;
};

export type CreateCommentDto = {
  postId: string;
  body: string;
  parentCommentId: string | null;
  files: UploadAttachment[];
};

export type EditCommentDto = Omit<CreateCommentDto, 'parentCommentId'> & {
  commentId: string;
};

export type FetchPostsFeedDto = {
  page?: number;
  pageSize?: number;
  includeOnlySaved?: boolean;
};

export type ReportCommentDto = {
  commentId: string;
  postId: string;
  message: string;
};

export type GetReportedPostsDto = PaginationParams & {
  communityId: string;
};

export enum PostLabelEnum {
  Urgent = 1,
  OpportunityCollaborate = 2,
  OpportunityContinue = 3,
  Knowledge = 4,
}

export enum PostReportTypeEnum {
  InappropriateContent = 1,
  PrivacyContent = 2,
  SharePostInOtherGroups = 3,
  RemovePost = 4,
}

export enum PostStatus {
  Default = 0,
  Published = 1,
  WaitForApproval = 2,
  Deleted = 3,
  ArchivedDueToReported = 4,
  Acrhived = 99,
}
