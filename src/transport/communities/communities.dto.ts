import { UploadFile } from 'antd';
import {
  PermissionDto,
  UserProfileDto,
  UserRole,
} from '../account/account.dto';
import { Attachment, PostStatus } from '../posts/posts.dto';
import { PaginationParams, PaginationResponse } from '../types';

export type CommunitiyDto = {
  about: string | null;
  alias: string;
  aliveEndDate: string | null;
  aliveStartDate: string | null;
  archivedDate: Date;
  categories: CommunitiyCategoryDto[];
  categoryIds: string[];
  createdAt: Date;
  createdByUserId: string;
  description?: null;
  id: string;
  imageUrl: string | null;
  isArchived: boolean;
  isAutoJoin: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isLiked: boolean;
  isPublic: boolean;
  isRequireAgreement: boolean;
  isRequirePostApproval: boolean;
  pushToWebSite: boolean;
  isVisible: boolean;
  likesCount: number;
  membersCount: number;
  pendingMembersCount: number;
  name: string;
  postsCount: number;
  segmentIds: string[] | null;
  shortDescription: string;
  tagsId: string[] | null;
  updatedAt: Date;
  latestActivity: Date;
  updatedByUserId: string;
  viewsCount: number;
  permissions: PermissionDto | null;
};

export type CommunityUser = {
  community: CommunitiyDto;
  status: CommunityStatus | null;
  role: CommunityRole;
  joinedAt: Date;
  permissions: PermissionDto;
};

export type CommunitiesPreferenceItem = Pick<
  CommunitiyDto,
  'id' | 'name' | 'imageUrl' | 'shortDescription' | 'alias'
>;

export type CommunitiesPreference = {
  topJoined: CommunitiesPreferenceItem[];
  topModerated: CommunitiesPreferenceItem[];
  joinedCount: number;
};

export type MeetingCommunityItem = {
  id: string;
  imageUrl?: string;
  name: string;
  shortDescription?: string;
};

export type MeetingPreference = {
  communities: MeetingCommunityItem[];
  totalIncoming: number;
  totalUpcoming: number;
};

export type CommunitiyCategoryDto = {
  id: string;
  name: string;
  createdAt: Date;
  createdByUserId: string;
  createdBy?: UserProfileDto;
  description?: string;
  color?: string;
  parentCategoryId: string | null;
  communityCount: number;
  subCategories: CommunitiyCategoryDto[];
  subCategoriesCount: number;
  updatedAt: Date;
  updatedByUserId: string;
};

export type CommunityMember = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  role: CommunityRole;
  status: CommunityStatus;
  avatarUrl: number;
  joinedAt: Date | null;
  pronoun: string;
  organisationName?: string;
  organisationEmail?: string;
  location?: string;
  jobTitle?: string;
  homeState?: string;
  reason?: string;
  isHaveAnswers: boolean | null;
};

export type CommunityMeeting = {
  id: string;
  name: string;
  description: string;
  meetingId: string | null;
  meetingLink: string | null;
  meetingPassword: string | null;
  startDate: Date;
  duration: string;
  rsvpDate: Date | null;
  createdAt: Date;
  users: MeetingMember[];
  visible: number;
  sendNotification: boolean;
  toDashBoard: boolean;
  imageUrl: string | null;
};

export type DashboardMeeting = CommunityMeeting & {
  communityId: string;
  community: {
    id: string;
    imageUrl: string;
    name: string;
    shortDescription: string;
  };
  endDate: string;
};

export type DashboardMeetStatus = {
  meet: DashboardMeeting;
  status: number | null;
  isFavorite: boolean;
};

export type MeetingMember = {
  id: string;
  meetId: string;
  status: MeetingStatus;
  createdAt: string;
  userId: string;
};

export type MeetStatus = {
  meet: CommunityMeeting;
  status: number | null;
  isFavorite: boolean;
};

export type ExploreMeet = {
  id: string;
  name: string;
  communityId: string;
  description: string;
  meetingLink: string;
  meetingId: string;
  meetingPassword: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  createdAt: string;
  createdByUserId: string;
  userGoCount: number;
  userNoGoCount: number;
  userNoAnswerCount: number;
  isFavorite: boolean;
  visible: number;
  imageUrl: string | null;
  rsvpDate: Date | null;
};

export type ExploreMeetStatus = {
  meet: ExploreMeet;
  status: number | null;
  isFavorite: boolean;
};

export type CreateMeetingDto = {
  id?: string;
  name: string;
  description: string;
  meetingLink: string;
  meetingId?: string;
  meetingPassword?: string;
  rsvpDate?: Date | null;
  startDate: string;
  duration: string;
  visible: number;
  sendNotification: boolean;
  bisableRSVPDate?: boolean;
  imageFile?: UploadFile | null;
};

export type CreateCommunityDto = {
  name: string;
  alias: string;
  categoryIds: string[];
  isPublic: boolean;
  segmentIds: string[];
  isAutoJoin: boolean;
  isRequirePostApproval: boolean;
  imageFile?: UploadFile;
  aliveStartDate?: string;
  aliveEndDate?: string;
  archivedDate?: string;
  isArchived?: boolean;
  tagsId?: string[];
};

export type GetCommunitiesListDto = {
  page?: number;
  pageSize?: number;
  keyword?: string;
  categoryIds?: string[];
  communityIds?: string[];
  startDate?: string;
  endDate?: string;
  onlyJoined?: boolean;
  onlyFavorite?: boolean;
};

export type Assets = {
  id: string;
  meetId: string;
  createdAt: string;
  path: string;
  fileName: string;
};

export type EditMemberRoleOrStatusDto = {
  communityId: string;
  userId: string;
  role?: CommunityRole;
  status?: CommunityStatus;
};

export type GetCommunitiesListResponse = Promise<
  PaginationResponse<{
    communities: CommunityUser[];
  }>
>;

export type GetCommunityPostsParams = PaginationParams<{
  id: string;
}>;

export type GetAdminCommunityPostsParams = PaginationParams<{
  communityId?: string;
  postId?: string;
  status?: PostStatus;
}>;

export type GetCommunityMembersParams = PaginationParams<{
  id: string;
  status?: CommunityStatus[];
  userId?: string;
  role?: CommunityRole;
}>;

export interface GetCommunityMembersAdminsParams
  extends Omit<GetCommunityMembersParams, 'status' | 'role'> {
  status?: Array<CommunityStatus>;
  userId?: string;
  role?: UserRole;
}

export type GetCommunityMeetingsParams = PaginationParams<{
  id: string;
}>;

export type GetExploreMeetingsParams = PaginationParams<{
  page?: number;
  pageSize?: number;
  communitiesIds?: string[] | null;
  statuses?: MeetingStatus[] | null;
  startDate?: string;
  endDate?: string;
  showPast?: boolean;
  showUpcoming?: boolean;
  onlyFavorite?: boolean;
}>;

export type EditCommunityDto = {
  id: string;
} & Partial<CreateCommunityDto>;

export type CreateCommunityCategoryDto = {
  name: string;
  description?: string;
  color: string;
  parentCategoryId?: string | null;
};

export type GetCommunityByIdResponse = {
  community: CommunityUser;
};

export type EditCommunityCategoryDto = CreateCommunityCategoryDto & {
  id: string;
};

export type CommunityAboutDto = {
  id: number;
  contentDescription: string;
};

export type GetDashboardMeetingsParams = PaginationParams<{
  viewMeetsWithAllAnswers?: boolean;
}>;

export type GetDashboardMeetingsResponse = Promise<
  PaginationResponse<{ meets: DashboardMeetStatus[] }>
>;

export type CommunityThreadDto = {
  id: number;
  pinned: boolean;
  name: string;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  lastActionAt: Date | null;
  createdById: number;
};

export type GetCommunityPostsStatisticsResponse = {
  allPostsCount: number;
  pendingPostsCount: number;
  reportedPostsCount: number;
  reportedPostCommentsCount: number;
  archivedPostsCount: number;
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

export type CommunityAdmin = {
  id: string;
  email: string;
  role: UserRole;
};

export type CommunityMemberDto = {
  id: number;
  firstName: string;
  lastName: string;
  avatarSrc: string;
};

export enum CommunityRole {
  Member = 0,
  CommunityMoModerator = 1,
  Editor = 2,
}

export enum CommunityStatus {
  Awaiting = 1,
  Joined = 2,
  Blocked = 3,
  Removed = 4,
}

export enum MeetingStatus {
  Going = 1,
  CantGo = 2,
  NoResponse = 0,
}

export enum CommunityAccessibility {
  Public = 1,
  Private = 2,
}

export enum CommunityVisibility {
  Visible = 1,
  Hidden = 2,
}

export enum WhoCanPost {
  All = 1,
  OnlyMembers = 2,
}

export interface CommunityPreference {
  createdCommunityIds: Array<string>;
  followedCommunityIds: Array<string>;
  awaitingCommunityIds: Array<string>;
  moderatedCommunityIds: Array<string>;
  // topFollowed?: Array<CommunitiyDto['community']> | null;
  // topTwoModerated?: Array<CommunitiyDto['community']> | null;
}

export type CommunityAssetsFolder = {
  id: string;
  name: string;
  description: string;
  expanded: boolean;
  order: number;
  createdAt: Date;
  communityId: string;
};

export enum AssetsTypeEnum {
  Folder = 0,
  Link = 1,
  PDF = 2,
  PPT = 3,
  MP4 = 4,
  JPG = 5,
  PNG = 6,
  XLS = 7,
  PPTX = 8,
  XLSX = 9,
  TXT = 10,
  DOC = 11,
  DOCX = 12,
}

export enum AssetsTypeDescriptionEnum {
  folder = 'folder',
  link = 'link',
  pdf = 'document',
  ppt = 'presentation',
  mp4 = 'video',
  jpg = 'image',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  png = 'image',
  xls = 'spreadsheet',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  pptx = 'presentation',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  xlsx = 'spreadsheet',
  txt = 'text',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  doc = 'document',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  docx = 'document',
  default = 'asset',
}

export type CommunityAssetsItem = {
  id: string;
  fileName: string;
  name: string;
  description: string;
  type: AssetsTypeEnum;
  createdAt: Date;
  path: string;
};

export type UserRelatedCommunity = {
  community: CommunitiyDto;
  isBlocked: boolean;
  role: CommunityRole;
  status: CommunityStatus;
};

export type GetUserRelatedCommunitiesResponse = PaginationResponse<{
  communities: UserRelatedCommunity[];
}>;

export interface SegmentProps {
  segmentId: string;
  segmentName: string;
}

export type AllSegmentsResponse = {
  segCategoryId: string;
  segCategoryName: string;
  segments: SegmentProps[];
};

export type SegmentsByCategoryResponse = {
  data: Record<string, string>;
};

export interface BlockedUsersResponse {
  blacklistUsers: BlockedUser[];
  args: BlockedUsersArgs;
  totalItemCount: number;
}

export interface BlockedUser {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  pronoun?: string;
  email: string;
  title: string;
  communityId: string;
  createdAt: string;
  createdByUserId: string;
}

export interface BlockedUsersArgs {
  page: number;
  pageSize: number;
}

type Community = {
  community: CommunitiyDto;
};

export type GetFavourites = {
  communities: Community[];
};

export type CommunityQuestion = {
  id: string;
  communityId: string;
  createdByUserId: string;
  updatedByUserId: string;
  isRequiredAssets: boolean;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateQuestionDto = {
  text: string;
  isRequiredAssets: boolean;
};

export type EditQuestionDto = CreateQuestionDto & {
  id: string;
};

export type GetAdminCommunityQuestionsDto = PaginationParams<{
  communityId: string;
}>;

export type GetAdminCommunityQuestionsResponse = PaginationResponse<{
  communityQuestions: CommunityQuestion[];
}>;

export type JoinCommunityDto = Array<{
  questionId: string;
  answer: string;
}>;

export type GetCommunityMemberAnswersDto = PaginationParams<{
  communityId: string;
  memberId: string;
}>;

export type AnswerDto = {
  memberId: string;
  answerText: string;
  attachments: Attachment[];
  createdAt: Date;
  member: CommunityMember;
  questionText: string;
};

export type GetCommunityMemberAnswersResponse = PaginationResponse<{
  questionAnswers: AnswerDto[];
}>;
