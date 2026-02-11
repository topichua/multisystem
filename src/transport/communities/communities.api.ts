import { UploadAttachment } from 'src/components/common/UploadAttachments/UploadAttachments.tsx';
import axiosBond from 'src/transport/axios/axios-bond-instance.ts';
import axio2s from '../axios/axios-instance';
import { Comment, Post, PostStatus } from '../posts/posts.dto';

import { PaginationParams, PaginationResponse } from '../types';
import {
  AllSegmentsResponse,
  Assets,
  BlockedUsersResponse,
  CommunitiesPreference,
  CommunitiyCategoryDto,
  CommunitiyDto,
  CommunityAdmin,
  CommunityMeeting,
  CommunityMember,
  CreateCommunityCategoryDto,
  CreateCommunityDto,
  CreateMeetingDto,
  CreateQuestionDto,
  EditCommunityCategoryDto,
  EditCommunityDto,
  EditMemberRoleOrStatusDto,
  EditQuestionDto,
  ExploreMeetStatus,
  GetAdminCommunityPostsParams,
  GetAdminCommunityQuestionsDto,
  GetAdminCommunityQuestionsResponse,
  GetCommunitiesListDto,
  GetCommunitiesListResponse,
  GetCommunityByIdResponse,
  GetCommunityMeetingsParams,
  GetCommunityMemberAnswersDto,
  GetCommunityMemberAnswersResponse,
  GetCommunityMembersAdminsParams,
  GetCommunityMembersParams,
  GetCommunityPostsParams,
  GetCommunityPostsStatisticsResponse,
  GetDashboardMeetingsParams,
  GetDashboardMeetingsResponse,
  GetExploreMeetingsParams,
  GetFavourites,
  GetUserRelatedCommunitiesResponse,
  CommunityRole,
  CommunityStatus,
  JoinCommunityDto,
  MeetingPreference,
  MeetStatus,
} from './communities.dto';
import { UserRole } from '../account/account.dto';
import { UploadFile } from 'antd';

// Shared mock helpers to keep communities data consistent across methods
const MOCK_COMMUNITIES_TOTAL = 20; // ensure >=15
const MOCK_TIME_BASE = 1735689600000; // Fixed timestamp for stable mock dates (2025-01-01)

const buildMockCategoryPool = (now: number) =>
  Array.from({ length: 6 }, (_, i) => ({
    id: `cat-${i + 1}`,
    name: `Category ${i + 1}`,
    createdAt: new Date(now - (i + 1) * 86400_000),
    createdByUserId: `user-${(i % 3) + 1}`,
    description: `Description for Category ${i + 1}`,
    color: ['#5B8FF9', '#61DDAA', '#65789B', '#F6BD16', '#7262fd', '#78D3F8'][i % 6],
    parentCategoryId: null,
    communityCount: (i + 1) * 3,
    subCategories: [],
    subCategoriesCount: 0,
    updatedAt: new Date(now - i * 43200_000),
    updatedByUserId: `user-${(i % 5) + 1}`,
  }));

const buildMockCommunities = () => {
  const now = MOCK_TIME_BASE;
  const categoryPool = buildMockCategoryPool(now);

  return Array.from({ length: MOCK_COMMUNITIES_TOTAL }, (_, idx) => {
    const i = idx + 1;
    const id = `community-${i}`;
    const isPublic = i % 2 === 0;
    const isAutoJoin = i % 4 === 0;
    const isFavorite = i % 3 === 0;
    const isLiked = i % 5 === 0;
    const membersCount = 50 + i * 7;
    const likesCount = 10 + i * 2;
    const viewsCount = 100 + i * 17;
    const postsCount = (i * 3) % 50;
    const pendingMembersCount = i % 6;
    const categories = [categoryPool[i % categoryPool.length]];
    const categoryIds = categories.map((c) => c.id);
    const alias = `community-${i}`;

    const community = {
      about: null,
      alias,
      aliveEndDate: null,
      aliveStartDate: null,
      archivedDate: new Date(now - i * 7200_000),
      categories,
      categoryIds,
      createdAt: new Date(now - i * 86400_000),
      createdByUserId: `user-${(i % 7) + 1}`,
      description: null,
      id,
      imageUrl:
        i % 4 === 0
          ? `https://picsum.photos/seed/community-${i}/400/300`
          : null,
      isArchived: i % 11 === 0,
      isAutoJoin,
      isDeleted: false,
      isFavorite,
      isLiked,
      isPublic,
      isRequireAgreement: i % 3 === 0,
      isRequirePostApproval: i % 5 === 0,
      pushToWebSite: i % 7 === 0,
      isVisible: true,
      likesCount,
      membersCount,
      pendingMembersCount,
      name: `Mock Community ${i}`,
      postsCount,
      segmentIds: i % 3 === 0 ? [`seg-${(i % 4) + 1}`] : null,
      shortDescription: `This is a mocked short description for community ${i}.`,
      tagsId: i % 2 === 0 ? [`tag-${(i % 3) + 1}`] : null,
      updatedAt: new Date(now - (i - 1) * 3600_000),
      latestActivity: new Date(now - i * 1800_000),
      updatedByUserId: `user-${(i % 7) + 1}`,
      viewsCount,
      permissions: null,
    };

    const status = i % 4 === 0 ? CommunityStatus.Joined : null;
    const role = CommunityRole.Member;
    const permissions = {
      generalManagers: false,
      generalCommunities: false,
      generalCategories: false,
      generalTags: false,
      generalFaq: false,
      generalAnnouncements: false,
      generalTc: false,
      communityCreate: false,
      communityEdit: false,
      communityClose: false,
      communityAddModerator: false,
      communityAddEditor: false,
      communityAddMember: false,
      communityBlacklist: false,
      postCreate: false,
      postApprove: false,
      postEdit: false,
      postDelete: false,
      commentCreate: false,
      commentEdit: false,
      commentDelete: false,
      meetingAll: false,
      assetsAll: false,
    };

    return {
      community,
      status,
      role,
      joinedAt: new Date(now - i * 7200_000),
      permissions,
    };
  });
};

const buildMockPosts = () => {
  const totalMockCount = 400; // more posts so every community has plenty
  const now = MOCK_TIME_BASE;

  const allPosts: Post[] = Array.from({ length: totalMockCount }, (_, idx) => {
    const i = idx + 1;
    const isSaved = i % 3 === 0;
    const isLiked = i % 5 === 0;

    return {
      id: `mock-post-${i}`,
      communityId: `community-${((i - 1) % MOCK_COMMUNITIES_TOTAL) + 1}`,
      title: `Mock Post Title ${i}`,
      body: `This is a mocked post body for item ${i}. It exists to help exercise pagination and "load more" behavior in the feed.`,
      createdAt: new Date(now - i * 3600_000),
      updatedAt: new Date(now - (i - 1) * 1800_000),
      status: PostStatus.Published,
      createdByUserId: `user-${(i % 7) + 1}`,
      isFrozen: false,
      imageUrl:
        i % 4 === 0
          ? `https://picsum.photos/seed/mock-${i}/600/400`
          : undefined,
      likesCount: i * 2,
      viewsCount: i * 10,
      commentsCount: i % 6,
      isLiked,
      isSaved,
      tags: [{ id: `tag-${(i % 3) + 1}`, name: `Tag ${(i % 3) + 1}` }],
    };
  });

  return allPosts;
};

const buildMockMeetings = () => {
  const totalMockCount = 30;
  const now = MOCK_TIME_BASE;

  const allMeets: MeetStatus[] = Array.from(
    { length: totalMockCount },
    (_, idx) => {
      const i = idx + 1;
      const communityId = `community-${(i % 5) + 1}`;
      const startDate = new Date(now + i * 86400_000);
      const rsvpDate =
        i % 2 === 0 ? new Date(startDate.getTime() - 2 * 86400_000) : null;
      const isFavorite = i % 4 === 0;
      const status = i % 3; // 0,1,2 aligning with MeetingStatus enum numeric values

      const meet: CommunityMeeting = {
        id: `mock-meet-${i}`,
        name: `Mock Meeting ${i}`,
        description: `This is a mocked meeting ${i} for ${communityId}.`,
        meetingId: `m-${1000 + i}`,
        meetingLink: `https://example.com/meet/${i}`,
        meetingPassword: i % 2 === 0 ? `pass-${i}` : null,
        startDate,
        duration: `${45 + (i % 3) * 15}`,
        rsvpDate,
        createdAt: new Date(now - i * 3600_000),
        users: [],
        visible: 1,
        sendNotification: false,
        toDashBoard: i % 5 === 0,
        imageUrl:
          i % 3 === 0
            ? `https://picsum.photos/seed/meet-${i}/600/360`
            : null,
      };

      return { meet, status, isFavorite };
    }
  );

  return allMeets;
};

const buildMockExploreMeetings = () => {
  const totalMockCount = 120;
  const now = MOCK_TIME_BASE;

  const meets: ExploreMeetStatus[] = Array.from(
    { length: totalMockCount },
    (_, idx) => {
      const i = idx + 1;
      const communityId = `community-${((i - 1) % MOCK_COMMUNITIES_TOTAL) + 1}`;
      const startDate =
        i % 2 === 0
          ? new Date(now + i * 86400_000)
          : new Date(now - i * 86400_000);
      const endDate = new Date(startDate.getTime() + (60 + (i % 3) * 30) * 60_000);
      const rsvpDate =
        i % 3 === 0 ? new Date(startDate.getTime() - 2 * 86400_000) : null;
      const isFavorite = i % 5 === 0;
      const status = i % 3; // 0,1,2 cycle

      const meet = {
        id: `explore-meet-${i}`,
        name: `Explore Meeting ${i}`,
        communityId,
        description: `This is a mocked explore meeting ${i} for ${communityId}.`,
        meetingLink: `https://example.com/explore/meet/${i}`,
        meetingId: `em-${10000 + i}`,
        meetingPassword: i % 4 === 0 ? `exp-${i}` : '',
        startDate,
        endDate,
        duration: `${60 + (i % 3) * 30}`,
        createdAt: new Date(now - i * 3600_000).toISOString(),
        createdByUserId: `user-${(i % 7) + 1}`,
        userGoCount: (i * 3) % 50,
        userNoGoCount: (i * 2) % 25,
        userNoAnswerCount: (i * 5) % 40,
        isFavorite,
        visible: 1,
        imageUrl:
          i % 3 === 0
            ? `https://picsum.photos/seed/explore-${i}/600/360`
            : null,
        rsvpDate,
      };

      return { meet, status, isFavorite };
    }
  );

  return meets;
};

const buildMockCommunityMembers = (communityId: string) => {
  const now = MOCK_TIME_BASE;
  const totalMembers = 48;
  const roles = [
    CommunityRole.Member,
    CommunityRole.CommunityMoModerator,
    CommunityRole.Editor,
  ];
  const states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
  const titles = ['Member', 'Contributor', 'Editor', 'Moderator'];
  const pronouns = ['she/her', 'he/him', 'they/them'];
  const orgs = ['Acme Health', 'Bond Labs', 'MX Pharma', 'Wellness Co'];

  const members: CommunityMember[] = Array.from(
    { length: totalMembers },
    (_, idx) => {
      const i = idx + 1;
      const userNum = ((idx + 1) % 70) + 1;
      const role = roles[i % roles.length];
      // Heavier weight on Joined, occasional Awaiting/Blocked/Removed
      const status =
        i % 11 === 0
          ? CommunityStatus.Blocked
          : i % 13 === 0
          ? CommunityStatus.Removed
          : i % 7 === 0
          ? CommunityStatus.Awaiting
          : CommunityStatus.Joined;

      const isJoined = status === CommunityStatus.Joined;
      const joinedAt = isJoined ? new Date(now - i * 86400_000) : null;

      return {
        id: `member-${communityId}-${i}`,
        userId: `user-${userNum}`,
        firstName: `First${userNum}`,
        lastName: `Last${userNum}`,
        email: `user${userNum}@example.com`,
        title: titles[i % titles.length],
        role,
        status,
        avatarUrl: userNum, // dto expects number
        joinedAt,
        pronoun: pronouns[i % pronouns.length],
        organisationName: orgs[i % orgs.length],
        organisationEmail: `contact@${orgs[i % orgs.length]
          .toLowerCase()
          .replace(/\s+/g, '')}.com`,
        location: `Location ${((i - 1) % 10) + 1}`,
        jobTitle: i % 3 === 0 ? 'Pharmacist' : i % 3 === 1 ? 'Researcher' : 'Manager',
        homeState: states[i % states.length],
        reason: i % 5 === 0 ? 'Interested in community updates' : '',
        isHaveAnswers: i % 4 === 0 ? true : null,
      };
    }
  );

  return members;
};

export const communityApi = {
  getAllCommunities(
    page: number = 1,
    pageSize = 1000
  ): Promise<PaginationResponse<{ communities: Array<CommunitiyDto> }>> {
    return axio2s.get(
      `api/v1/admin/community?page=${page}&pageSize=${pageSize}`
    );
  },

  getCommunityAdmin(
    id: string
  ): Promise<PaginationResponse<{ communities: Array<CommunitiyDto> }>> {
    return axio2s.get(`api/v1/admin/community?page=1&pageSize=1&id=${id}`);
  },

  getCommunitiesList({
    page = 1,
    pageSize = 1000,
    onlyJoined = false,
    ...restOptions
  }: GetCommunitiesListDto): GetCommunitiesListResponse {
    const allCommunities = buildMockCommunities();

    const {
      communityIds,
      categoryIds,
      keyword,
      onlyFavorite,
    }: {
      communityIds?: string[];
      categoryIds?: string[];
      keyword?: string;
      onlyFavorite?: boolean;
    } = restOptions as any;

    let filtered = allCommunities.slice();

    if (communityIds && communityIds.length > 0) {
      const set = new Set(communityIds);
      filtered = filtered.filter((cu) => set.has(cu.community.id));
    }

    if (categoryIds && categoryIds.length > 0) {
      const catSet = new Set(categoryIds);
      filtered = filtered.filter((cu) =>
        cu.community.categoryIds.some((cid) => catSet.has(cid))
      );
    }

    if (typeof keyword === 'string' && keyword.trim().length > 0) {
      const kw = keyword.trim().toLowerCase();
      filtered = filtered.filter(
        (cu) =>
          cu.community.name.toLowerCase().includes(kw) ||
          cu.community.alias.toLowerCase().includes(kw) ||
          cu.community.shortDescription.toLowerCase().includes(kw)
      );
    }

    if (onlyFavorite) {
      filtered = filtered.filter((cu) => cu.community.isFavorite);
    }

    if (onlyJoined) {
      filtered = filtered.filter((cu) => cu.status === CommunityStatus.Joined);
    }

    const start = (page - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);

    return Promise.resolve({
      communities: pageItems,
      args: { page, pageSize },
      totalItemCount: filtered.length,
    });
  },

  getPreference(): Promise<CommunitiesPreference> {
    const all = buildMockCommunities();
    const joined = all.filter((c) => c.status === CommunityStatus.Joined);

    const toPrefItem = (c: typeof all[number]['community']) => ({
      id: c.id,
      name: c.name,
      imageUrl: c.imageUrl,
      shortDescription: c.shortDescription,
      alias: c.alias,
    });

    // Top joined by membersCount
    const topJoined = joined
      .slice()
      .sort(
        (a, b) => b.community.membersCount - a.community.membersCount
      )
      .slice(0, 8)
      .map((cu) => toPrefItem(cu.community));

    // Top moderated (proxy: most likesCount) - we lack per-user moderation, so use a heuristic
    const topModerated = all
      .slice()
      .sort((a, b) => b.community.likesCount - a.community.likesCount)
      .slice(0, 8)
      .map((cu) => toPrefItem(cu.community));

    return Promise.resolve({
      topJoined,
      topModerated,
      joinedCount: joined.length,
    });
  },

  getFavourites(): Promise<GetFavourites> {
    const all = buildMockCommunities();
    const favourites = all
      .filter((c) => c.community.isFavorite)
      .map((c) => ({ community: c.community }));
    return Promise.resolve({ communities: favourites });
  },

  getMeetingPreference(): Promise<MeetingPreference> {
    return axio2s.get('api/v1/community/meeting/preference');
  },

  async getCommunityById(id: string): Promise<GetCommunityByIdResponse> {
    const allCommunities = buildMockCommunities();
    let found =
      allCommunities.find((cu) => cu.community.id === id) ||
      allCommunities.find((cu) => cu.community.alias === id);

    if (!found) {
      // Fallback: build a single entry derived from id
      const m = id.match(/community-(\d+)/);
      const idx = m ? Number(m[1]) : 1;
      const base = buildMockCommunities();
      found = {
        ...base[(idx - 1) % base.length],
        community: {
          ...base[(idx - 1) % base.length].community,
          id,
          alias: id,
          name: `Mock Community ${idx}`,
        },
      };
    }

    return Promise.resolve({ community: found });
  },

  async getCommunityByAlias(alias: string): Promise<GetCommunityByIdResponse> {
    return this.getCommunityById(alias);
  },

  async getCommunityAbout(id: string): Promise<string> {
    return axio2s.get(`api/v1/community/${id}/about`);
  },

  async editAbout(id: string, content: string) {
    return axio2s.put(`api/v1/admin/community/${id}/about`, content, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  async getCommunityPosts({
    id,
    page = 1,
    pageSize = 1000,
  }: GetCommunityPostsParams): Promise<PaginationResponse<{ posts: Post[] }>> {
    const allPosts = buildMockPosts().filter((p) => p.communityId === id);
    const start = (page - 1) * pageSize;
    const pagedPosts = allPosts.slice(start, start + pageSize);

    return Promise.resolve({
      posts: pagedPosts,
      args: { page, pageSize },
      totalItemCount: allPosts.length,
    });
  },

  async getAdminCommunityPosts({
    communityId,
    postId,
    page = 1,
    pageSize = 1000,
    status,
  }: GetAdminCommunityPostsParams): Promise<
    PaginationResponse<{ posts: Post[] }>
  > {
    return axio2s.get(
      `api/v1/admin/community/${communityId}/post?page=${page}&pageSize=${pageSize}`,
      {
        params: {
          status,
          communityId,
          id: postId,
        },
      }
    );
  },

  async createCommunity(community: CreateCommunityDto): Promise<null> {
    const { imageFile, segmentIds, tagsId, categoryIds, ...restCommunity } =
      community;

    const fd = new FormData();

    if (imageFile?.originFileObj) {
      fd.append('imageFile', imageFile.originFileObj);
    }

    segmentIds?.forEach((segmentId) => {
      fd.append('segmentIds', segmentId);
    });

    tagsId?.forEach((tagId) => {
      fd.append('tagsId', tagId);
    });

    for (const key in restCommunity) {
      const value = restCommunity[key as keyof typeof restCommunity];

      if (value !== undefined && value !== null) {
        fd.append(key, value.toString());
      }
    }

    if (categoryIds && categoryIds.length > 0) {
      categoryIds.forEach((categoryId) => {
        fd.append('categoryIds', categoryId);
      });
    }

    // if (categoryId) {
    //   fd.append('categoryIds', categoryId);
    // }

    return axio2s.post('api/v1/admin/community', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async editCommunity(community: EditCommunityDto): Promise<null> {
    const { imageFile, id, segmentIds, tagsId, categoryIds, ...restCommunity } =
      community;

    const fd = new FormData();

    if (imageFile?.originFileObj) {
      fd.append('imageFile', imageFile.originFileObj);
    }

    if (segmentIds?.length) {
      segmentIds?.forEach((segmentId) => {
        fd.append('segmentIds', segmentId);
      });
    } else {
      fd.append('isSetSegmentIdsEmpty', 'true');
    }

    for (const key in restCommunity) {
      const value = restCommunity[key as keyof typeof restCommunity];

      if (value !== undefined && value !== null) {
        fd.append(key, value.toString());
      }
    }

    tagsId?.forEach((tagId) => {
      fd.append('tagsId', tagId);
    });

    categoryIds?.forEach((categoryId) => {
      fd.append('categoryIds', categoryId);
    });

    return axio2s.put(`api/v1/admin/community/${id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async deleteCommunity(id: string) {
    return axio2s.delete(`api/v1/admin/community/${id}`);
  },

  async joinCommunity(id: string, answers?: JoinCommunityDto) {
    return axio2s.put(
      `api/v1/community/${id}/join`,
      answers ? { answers } : undefined
    );
  },

  async joinCommunitySendAnswerFiles(
    communityId: string,
    questionId: string,
    files: UploadFile[]
  ) {
    const fd = new FormData();

    files.forEach((file) => {
      if (file?.originFileObj) {
        fd.append(`files`, file.originFileObj, file.originFileObj.name);
      }
    });

    return axio2s.put(
      `api/v1/community/${communityId}/join/question/${questionId}/send-files`,
      fd
    );
  },

  async cancelJoinCommunity(communityId: string) {
    return axio2s.put(`api/v1/community/${communityId}/join/cancel`);
  },

  async unJoinCommunity(id: string) {
    return axio2s.put(`api/v1/community/${id}/unjoin`);
  },

  async getAllCategories(
    page: number = 1,
    pageSize: number = 100,
    onlyParents: boolean = false
  ): Promise<
    PaginationResponse<{ communityCategories: Array<CommunitiyCategoryDto> }>
  > {
    return await axio2s.get(
      `api/v1/admin/community/category?page=${page}&pageSize=${pageSize}`,
      {
        params: {
          page,
          pageSize,
          onlyParents,
        },
      }
    );
  },

  async getAllCategoriesPublic(
    page: number = 1,
    pageSize: number = 100
  ): Promise<
    PaginationResponse<{ communityCategories: Array<CommunitiyCategoryDto> }>
  > {
    // Build categories from mocked communities and aggregate communityCount
    const now = MOCK_TIME_BASE;
    const baseCategories = buildMockCategoryPool(now);
    const communities = buildMockCommunities();

    const counts: Record<string, number> = {};
    communities.forEach((c) => {
      c.community.categoryIds.forEach((cid) => {
        counts[cid] = (counts[cid] || 0) + 1;
      });
    });

    const allCategories: CommunitiyCategoryDto[] = baseCategories.map((cat) => ({
      ...cat,
      communityCount: counts[cat.id] || 0,
      subCategories: [],
      subCategoriesCount: 0,
    }));

    const start = (page - 1) * pageSize;
    const pageItems = allCategories.slice(start, start + pageSize);

    return Promise.resolve({
      communityCategories: pageItems,
      args: { page, pageSize },
      totalItemCount: allCategories.length,
    });
  },

  async createCategory(category: CreateCommunityCategoryDto): Promise<null> {
    return await axio2s.post('api/v1/admin/community/category', category);
  },

  async editCategory({
    id,
    ...restCategory
  }: EditCommunityCategoryDto): Promise<null> {
    return await axio2s.put(
      `api/v1/admin/community/category/${id}`,
      restCategory
    );
  },

  async deleteCategory(id: string): Promise<null> {
    return await axio2s.delete(`api/v1/admin/community/category/${id}`);
  },

  async getCommunityMembers({
    id,
    page = 1,
    pageSize = 1000,
  }: GetCommunityMembersParams): Promise<
    PaginationResponse<{ communityMembers: CommunityMember[] }>
  > {
    const allMembers = buildMockCommunityMembers(id);
    const start = (page - 1) * pageSize;
    const pageItems = allMembers.slice(start, start + pageSize);
    return Promise.resolve({
      communityMembers: pageItems,
      args: { page, pageSize },
      totalItemCount: allMembers.length,
    });
  },

  // async getCommunityMembersAdmin({
  //   id,
  //   page = 1,
  //   pageSize = 100,
  //   ...rest
  // }: GetCommunityMembersParams): Promise<
  //   PaginationResponse<{ communityMembers: CommunityMember[] }>
  // > {
  //   return await axio2s.get(`api/v1/admin/community/${id}/member`, {
  //     params: {
  //       page,
  //       pageSize,
  //       ...(rest || {}),
  //     },
  //   });
  // },

  async getCommunityMembersAdmin({
    id,
    page = 1,
    pageSize = 100,
    ...rest
  }: GetCommunityMembersAdminsParams): Promise<
    PaginationResponse<{ communityMembers: CommunityMember[] }>
  > {
    return await axio2s.post(`api/v1/admin/community/${id}/getlist`, {
      page,
      pageSize,
      ...(rest || {}),
    });
  },

  async getCommunityMembersAdminWithAnswers({
    id,
    page = 1,
    pageSize = 100,
    ...rest
  }: GetCommunityMembersAdminsParams): Promise<
    PaginationResponse<{ communityMembers: CommunityMember[] }>
  > {
    return await axio2s.post(
      `api/v1/admin/community/${id}/getlist-with-answers`,
      {
        page,
        pageSize,
        ...(rest || {}),
      }
    );
  },

  async editMemberRoleOrStatus({
    communityId,
    userId,
    ...data
  }: EditMemberRoleOrStatusDto) {
    return await axio2s.put(
      `api/v1/admin/community/${communityId}/member/${userId}`,
      data
    );
  },

  async removeMember(communityId: string, userId: string) {
    return await axio2s.delete(
      `api/v1/admin/community/${communityId}/member/${userId}`
    );
  },

  async getCommunityMeetings({
    id,
    page = 1,
    pageSize = 100,
  }: GetCommunityMeetingsParams): Promise<
    PaginationResponse<{ meets: MeetStatus[] }>
  > {
    const allMeets = buildMockMeetings();
    // Map meeting id to community using same distribution as posts/communities (mod MOCK_COMMUNITIES_TOTAL)
    const toCommunityId = (meetingId: string) => {
      const n = Number(meetingId.replace('mock-meet-', '')) || 1;
      return `community-${((n - 1) % MOCK_COMMUNITIES_TOTAL) + 1}`;
    };
    const filtered = allMeets.filter((m) => toCommunityId(m.meet.id) === id);
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    return Promise.resolve({
      meets: paged,
      args: { page, pageSize },
      totalItemCount: filtered.length,
    });
  },

  async getMeetingById(
    communityId: string,
    meetingId: string
  ): Promise<{ meet: MeetStatus }> {
    const allMeets = buildMockMeetings();
    let found = allMeets.find((m) => m.meet.id === meetingId);

    if (!found) {
      // Fallback: derive from meetingId if pattern matches
      const m = meetingId.match(/mock-meet-(\d+)/);
      const i = m ? Number(m[1]) : 1;
      const base = buildMockMeetings();
      found = {
        ...base[(i - 1) % base.length],
        meet: {
          ...base[(i - 1) % base.length].meet,
          id: meetingId,
          name: `Mock Meeting ${i}`,
        },
      };
    }

    // Ensure community consistency; if mismatch, adjust description to reflect desired community
    if (communityId) {
      found = {
        ...found,
        meet: {
          ...found.meet,
          description: `This is a mocked meeting derived for ${communityId}.`,
        },
      };
    }

    return Promise.resolve({ meet: found });
  },

  async getExploreMeetings(
    params: GetExploreMeetingsParams
  ): Promise<PaginationResponse<{ meets: ExploreMeetStatus[] }>> {
    const {
      page = 1,
      pageSize = 100,
      communitiesIds,
      statuses,
      startDate,
      endDate,
      showPast,
      showUpcoming,
      onlyFavorite,
    } = params || ({} as GetExploreMeetingsParams);

    const all = buildMockExploreMeetings();
    const now = new Date(MOCK_TIME_BASE);

    let filtered = all.slice();

    if (communitiesIds && communitiesIds.length > 0) {
      const set = new Set(communitiesIds);
      filtered = filtered.filter((m) => set.has(m.meet.communityId));
    }

    if (statuses && statuses.length > 0) {
      const statusSet = new Set(statuses);
      filtered = filtered.filter((m) => statusSet.has(m.status as any));
    }

    if (startDate) {
      const sd = new Date(startDate).getTime();
      filtered = filtered.filter((m) => new Date(m.meet.startDate).getTime() >= sd);
    }
    if (endDate) {
      const ed = new Date(endDate).getTime();
      filtered = filtered.filter((m) => new Date(m.meet.endDate).getTime() <= ed);
    }

    if (showPast && !showUpcoming) {
      filtered = filtered.filter((m) => new Date(m.meet.startDate) < now);
    } else if (showUpcoming && !showPast) {
      filtered = filtered.filter((m) => new Date(m.meet.startDate) >= now);
    }

    if (onlyFavorite) {
      filtered = filtered.filter((m) => m.isFavorite);
    }

    const start = (page - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);

    return Promise.resolve({
      meets: pageItems,
      args: { page, pageSize },
      totalItemCount: filtered.length,
    });
  },

  getDashboardMeetings({
    page = 1,
    pageSize = 100,
    viewMeetsWithAllAnswers,
  }: GetDashboardMeetingsParams): GetDashboardMeetingsResponse {
    return axio2s.get(`api/v1/dashboard/meetings`, {
      params: {
        page,
        pageSize,
        viewMeetsWithAllAnswers,
      },
    });
  },

  async updateMeetingStatus(
    communityId: string,
    meetingId: string,
    newStatus: string
  ): Promise<null> {
    return await axio2s.post(
      `api/v1/community/${communityId}/meeting/${meetingId}`,
      newStatus,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  },

  async getCommunityMeetingsAdmin({
    id,
    page = 1,
    pageSize = 100,
  }: GetCommunityMeetingsParams): Promise<
    PaginationResponse<{ meets: CommunityMeeting[] }>
  > {
    return await axio2s.get(
      `api/v1/admin/community/${id}/meeting?page=${page}&pageSize=${pageSize}`
    );
  },

  async removeMeetingAdmin(communityId: string, meetingId: string) {
    return await axio2s.delete(
      `api/v1/admin/community/${communityId}/meeting/${meetingId}`
    );
  },

  async createMeetingAdmin(
    communityId: string,
    meeting: CreateMeetingDto
  ): Promise<string> {
    const { imageFile, ...restMeeting } = meeting;
    const fd = new FormData();

    fd.append('sendNotification', 'false');

    if (imageFile?.originFileObj) {
      fd.append('imageFile', imageFile.originFileObj);
    }

    for (const key in restMeeting) {
      const value = restMeeting[key as keyof typeof restMeeting];

      if (value) {
        fd.append(key, value.toString());
      }
    }

    return await axio2s.post(
      `api/v1/admin/community/${communityId}/meeting`,
      fd,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  },

  async editMeetingAmdin(
    communityId: string,
    meeting: CreateMeetingDto
  ): Promise<null> {
    const { imageFile, ...restMeeting } = meeting;
    const fd = new FormData();

    if (imageFile?.originFileObj) {
      fd.append('imageFile', imageFile.originFileObj);
    }

    for (const key in restMeeting) {
      const value = restMeeting[key as keyof typeof restMeeting];

      if (value) {
        fd.append(key, value.toString());
      }
    }

    return await axio2s.put(
      `api/v1/admin/community/${communityId}/meeting/${meeting.id}`,
      fd,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  },

  async sendNotificationMeetingAmdin(
    communityId: string,
    meetingId: string
  ): Promise<null> {
    const fd = new FormData();
    fd.append('sendNotification', 'true');

    return await axio2s.put(
      `api/v1/admin/community/${communityId}/meeting/${meetingId}`,
      fd
    );
  },

  async publishDashboardMeetingAmdin(
    communityId: string,
    meetingId: string
  ): Promise<null> {
    const fd = new FormData();
    fd.append('toDashBoard', 'true');

    return await axio2s.put(
      `api/v1/admin/community/${communityId}/meeting/${meetingId}`,
      fd
    );
  },

  addMeetingAsset: async function (
    communityId: string,
    meetId: string,
    file: UploadAttachment
  ): Promise<null> {
    const fd = new FormData();

    if (file.originFileObj) {
      fd.append('file', file.originFileObj);
    }

    return await axio2s.post(
      `/api/v1/community/${communityId}/meeting/${meetId}/asset`,
      fd,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  },

  async removeMeetingAsset(
    communityId: string,
    meetId: string,
    id: string
  ): Promise<null> {
    return await axio2s.delete(
      `/api/v1/community/${communityId}/meeting/${meetId}/asset/${id}`
    );
  },

  async getMeetingAssets(
    meetId: string,
    communityId: string
  ): Promise<PaginationResponse<{ assets: Assets[] }>> {
    return await axio2s.get(
      `api/v1/community/${communityId}/meeting/${meetId}/asset`
    );
  },

  async getCommentsReports({
    page = 1,
    pageSize = 100,
    communityId,
  }: PaginationParams<{ communityId: string }>): Promise<
    PaginationResponse<{ postComments: Comment[] }>
  > {
    return await axio2s.get(
      `api/v1/admin/community/${communityId}/comment/report?page=${page}&pageSize=${pageSize}`
    );
  },

  async getAdmins({
    page = 1,
    pageSize = 100,
    role = 3,
  }: PaginationParams<{ role?: UserRole }>): Promise<
    PaginationResponse<{ users: CommunityAdmin[] }>
  > {
    return await axio2s.get(
      `api/v1/admin/account/admin?page=${page}&pageSize=${pageSize}&role=${role}`
    );
  },

  async createAdmin(email: string, role: UserRole) {
    return await axio2s.post(`api/v1/admin/account/admin`, {
      userEmail: email,
      role,
    });
  },

  async deleteAdmin(email: string) {
    const encodedEmail = encodeURIComponent(email);
    return await axio2s.delete(
      `api/v1/admin/account/admin?userEmail=${encodedEmail}`
    );
  },

  async getCommunityPostsStatistics(
    communityId: string
  ): Promise<GetCommunityPostsStatisticsResponse> {
    return await axio2s.get(
      `api/v1/admin/community/${communityId}/post/statistics`
    );
  },

  async addToFavorite(communityId: string) {
    return await axio2s.post(`api/v1/community/${communityId}/add-to-favorite`);
  },

  async removeFromFavorite(communityId: string) {
    return await axio2s.post(
      `api/v1/community/${communityId}/delete-from-favorite`
    );
  },

  async addLikeToCommunity(communityId: string) {
    return await axio2s.post(`api/v1/community/${communityId}/like`);
  },

  async removeLikeFromCommunity(communityId: string) {
    return await axio2s.post(`api/v1/community/${communityId}/dislike`);
  },

  async viewCommunity(communityId: string) {
    return await axio2s.post(`api/v1/community/${communityId}/view`);
  },

  async addMembers(communityId: string, usersIds: string[]) {
    return await axio2s.post(
      `api/v1/admin/community/${communityId}/member`,
      usersIds
    );
  },

  async fetchRecommendedCommunities(): Promise<{
    communities: CommunitiyDto[];
  }> {
    return await axio2s.get('api/v1/dashboard/recommended/community');
  },

  async getCommunityAgreement(communityId: string) {
    return axio2s.get(`api/v1/community/${communityId}/terms`);
  },

  async saveCommunityAgreement(communityId: string, content: string) {
    return axio2s.put(`api/v1/admin/community/${communityId}/terms`, content, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  async getCommunitySegments(): Promise<{ data: AllSegmentsResponse[] }> {
    return await axiosBond.get(`/api/segment/all`);
  },

  async isExistsByAlias(alias: string): Promise<boolean> {
    return await axio2s.get(`api/v1/admin/community/exists-by-alias`, {
      params: {
        alias: alias,
      },
    });
  },

  getBlockedUsers({
    communityId,
    page = 1,
    pageSize = 100,
  }: {
    communityId: string;
    page?: number;
    pageSize?: number;
  }): Promise<BlockedUsersResponse> {
    return axio2s.get(`api/v1/admin/community/${communityId}/block`, {
      params: { page, pageSize },
    });
  },

  blockUser({
    communityId,
    users,
  }: {
    communityId: string;
    users: { userId: string; reason: string }[];
  }): Promise<void> {
    return axio2s.post(`api/v1/admin/community/${communityId}/block`, users);
  },

  updateReasonBlocking({
    communityId,
    userId,
    reason,
  }: {
    communityId: string;
    userId: string;
    reason: string;
  }): Promise<void> {
    return axio2s.put(`api/v1/admin/community/${communityId}/block/${userId}`, {
      reason: reason,
    });
  },

  unBlockUser(communityId: string, userIds: string[]): Promise<void> {
    return axio2s.post(
      `api/v1/admin/community/${communityId}/unblock`,
      userIds
    );
  },

  async addSaveToMeeting(communityId: string, meetingId: string) {
    return await axio2s.post(
      `api/v1/community/${communityId}/meeting/${meetingId}/add-to-favorite`
    );
  },

  async removeSaveFromMeeting(communityId: string, meetingId: string) {
    return await axio2s.post(
      `api/v1/community/${communityId}/meeting/${meetingId}/delete-from-favorite`
    );
  },

  async addMemberToMeeting(
    communityId: string,
    meetingId: string,
    usersIds: string[]
  ) {
    return await axio2s.put(
      `api/v1/admin/community/${communityId}/meeting/${meetingId}/add-members`,
      usersIds
    );
  },

  async removeMemberFromMeeting(
    communityId: string,
    meetingId: string,
    usersIds: string[]
  ) {
    return await axio2s.put(
      `api/v1/admin/community/${communityId}/meeting/${meetingId}/remove-members`,
      usersIds
    );
  },

  async getUserRelatedCommunities(
    userId: string,
    page = 1,
    pageSize = 100
  ): Promise<GetUserRelatedCommunitiesResponse> {
    return axio2s.get('api/v1/admin/community/members_and_blocked', {
      params: {
        userId,
        page,
        pageSize,
      },
    });
  },

  async createQuestion(
    communityId: string,
    question: CreateQuestionDto
  ): Promise<null> {
    return axio2s.post(`api/v1/admin/community/${communityId}/question`, {
      communityQuestions: [question],
    });
  },

  async editQuestion(
    communityId: string,
    question: EditQuestionDto
  ): Promise<null> {
    const { id, ...restQuestion } = question;
    return axio2s.put(
      `api/v1/admin/community/${communityId}/question/${id}`,
      restQuestion
    );
  },

  async deleteQuestion(communityId: string, questionId: string): Promise<null> {
    return axio2s.delete(
      `api/v1/admin/community/${communityId}/question/${questionId}`
    );
  },

  async getAdminCommunityQuestions({
    communityId,
    page = 1,
    pageSize = 1000,
  }: GetAdminCommunityQuestionsDto): Promise<GetAdminCommunityQuestionsResponse> {
    return axio2s.get(`api/v1/admin/community/${communityId}/question`, {
      params: {
        communityId,
        page,
        pageSize,
      },
    });
  },

  async getCommunityQuestions({
    communityId,
    page = 1,
    pageSize = 1000,
  }: GetAdminCommunityQuestionsDto): Promise<GetAdminCommunityQuestionsResponse> {
    return axio2s.get(`api/v1/community/${communityId}/join/question`, {
      params: {
        communityId,
        page,
        pageSize,
      },
    });
  },

  async getCommunityMemberAnswers({
    communityId,
    memberId,
    page = 1,
    pageSize = 1000,
  }: GetCommunityMemberAnswersDto): Promise<GetCommunityMemberAnswersResponse> {
    return axio2s.get(
      `api/v1/admin/community/${communityId}/question-answers`,
      {
        params: {
          memberId,
          page,
          pageSize,
        },
      }
    );
  },
};
