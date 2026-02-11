import { action, makeObservable, observable, reaction } from 'mobx';
import { PermissionDto } from 'src/transport/account/account.dto';

import { communityApi } from 'src/transport/communities/communities.api';
import {
  BlockedUser,
  CommunitiyDto,
  CommunityMeeting,
  CommunityMember,
  CommunityQuestion,
  CommunityStatus,
  CreateMeetingDto,
  EditMemberRoleOrStatusDto,
  GetCommunityPostsStatisticsResponse,
} from 'src/transport/communities/communities.dto';
import { postApi } from 'src/transport/posts/posts.api';
import { Comment, Post, PostStatus } from 'src/transport/posts/posts.dto';

export class CommunityManagementStore {
  public communityId: string;

  public isCommunityLoading: boolean = false;
  public community: CommunitiyDto | null = null;
  public communityPostsStatistics: GetCommunityPostsStatisticsResponse | null =
    null;
  public isCommunityPostsStatisticsLoading: boolean = false;
  public permissions: PermissionDto | null = null;

  public isCommunityAboutLoading: boolean = false;
  public communityAbout: string | null = null;

  public members: CommunityMember[] | null = null;
  public isMembersLoading: boolean = false;
  public membersCount: number | null = null;

  public bannedMembers: BlockedUser[] | null = null;
  public isBannedMembersLoading: boolean = false;
  public bannedMembersCount: number | null = null;

  public deletedMembers: CommunityMember[] | null = null;
  public isDeletedMembersLoading: boolean = false;
  public deletedMembersCount: number | null = null;

  public meetings: CommunityMeeting[] | null = null;
  public isMeetingsLoading: boolean = false;
  public isEditMeetingLoading: boolean = false;
  public isCreateMeetingLoading: boolean = false;
  public meetingsCount: number | null = null;

  public isChangeMemberRoleLoading: boolean = false;
  public isUnBlockUserLoading: boolean = false;
  public isUnDeleteLoading: boolean = false;
  public isRemoveMemberLoading: boolean = false;

  public isCommentsReportsLoading: boolean = false;
  public commentsReports: Comment[] | null = null;

  public isPostsLoading: boolean = false;
  public communityPosts: Post[] | null = null;

  public isApprovalPostsLoading: boolean = false;
  public isApprovalOrDeclinePostLoading: boolean = false;
  public communityApprovalPosts: Post[] | null = null;

  public isReportedPostsLoading: boolean = false;
  public reportedPosts: Post[] | null = null;

  public isArchivedPostsLoading: boolean = false;
  public archivedPosts: Post[] | null = null;

  public isAddMembersLoading: boolean = false;

  public isBanMembersLoading: boolean = false;

  public isDeleteMembersLoading: boolean = false;

  public questions: CommunityQuestion[] = [];
  public isQuestionsLoading: boolean = false;

  constructor(communityId: string) {
    this.communityId = communityId;

    makeObservable(this, {
      isCommunityLoading: observable,
      isCommunityAboutLoading: observable,
      communityAbout: observable,
      community: observable,
      members: observable,
      isMembersLoading: observable,
      membersCount: observable,
      bannedMembers: observable,
      isBannedMembersLoading: observable,
      bannedMembersCount: observable,
      deletedMembers: observable,
      isDeletedMembersLoading: observable,
      deletedMembersCount: observable,
      isChangeMemberRoleLoading: observable,
      isRemoveMemberLoading: observable,
      isCommentsReportsLoading: observable,
      commentsReports: observable,

      isUnBlockUserLoading: observable,
      unBlockUser: action,

      isUnDeleteLoading: observable,
      // unBlockUser: action,

      meetings: observable,
      isMeetingsLoading: observable,
      meetingsCount: observable,
      isEditMeetingLoading: observable,
      isCreateMeetingLoading: observable,

      communityPostsStatistics: observable,
      isCommunityPostsStatisticsLoading: observable,
      permissions: observable,

      isPostsLoading: observable,
      communityPosts: observable,

      isReportedPostsLoading: observable,
      reportedPosts: observable,

      isApprovalPostsLoading: observable,
      isApprovalOrDeclinePostLoading: observable,
      communityApprovalPosts: observable,

      isArchivedPostsLoading: observable,
      archivedPosts: observable,

      isAddMembersLoading: observable,
      addMembersToCommunity: action,

      questions: observable,
      isQuestionsLoading: observable,

      isBanMembersLoading: observable,
      banMembers: action,

      loadCommunity: action,
      loadCommunityPostsStatistic: action,
      loadCommunityAbout: action,
      loadMembers: action,
      loadMeetings: action,
      removeMeeting: action,
      editMeeting: action,
      createMeeting: action,
      changeMemberRole: action,
      removeMember: action,
      loadCommentsReports: action,
      loadPosts: action,
      loadApprovalPosts: action,
      setPostStatus: action,
      loadReportedPosts: action,
      loadArchivedPosts: action,
      loadQuestions: action,
    });

    reaction(
      () => {},
      () => {}
    );
  }

  public loadMembers = () => {
    this.isMembersLoading = true;

    communityApi
      .getCommunityMembersAdminWithAnswers({
        id: this.communityId,
        status: [CommunityStatus.Awaiting, CommunityStatus.Joined],
      })
      .then((res) => {
        this.members = res.communityMembers;
        this.membersCount = res.totalItemCount;
      })
      .finally(() => {
        this.isMembersLoading = false;
      });
  };

  public loadQuestions = () => {
    this.isQuestionsLoading = true;

    return communityApi
      .getAdminCommunityQuestions({ communityId: this.communityId })
      .then((res) => {
        this.questions = res.communityQuestions;
      })
      .finally(() => {
        this.isQuestionsLoading = false;
      });
  };

  public loadBannedMembers = () => {
    this.isBannedMembersLoading = true;

    communityApi
      .getBlockedUsers({
        communityId: this.communityId,
      })
      .then((res) => {
        this.bannedMembers = res.blacklistUsers;
        this.bannedMembersCount = res.totalItemCount;
      })
      .finally(() => {
        this.isBannedMembersLoading = false;
      });
  };

  public loadCommunity = () => {
    this.isCommunityLoading = true;

    return communityApi
      .getCommunityAdmin(this.communityId)
      .then((community) => {
        const [fetchedCommunity] = community.communities;
        this.community = fetchedCommunity;
        this.permissions = fetchedCommunity?.permissions;
      })
      .finally(() => {
        this.isCommunityLoading = false;
      });
  };

  public loadCommunityAbout = () => {
    this.isCommunityAboutLoading = true;
    communityApi
      .getCommunityAbout(this.communityId)
      .then((communityAbout) => {
        this.communityAbout = communityAbout;
      })
      .finally(() => {
        this.isCommunityAboutLoading = false;
      });
  };

  public loadPosts = (status: PostStatus | null) => {
    this.isPostsLoading = true;

    communityApi
      .getAdminCommunityPosts({
        communityId: this.communityId,
        status: status === null ? undefined : status,
      })
      .then(({ posts }) => {
        this.communityPosts = posts;
      })
      .finally(() => {
        this.isPostsLoading = false;
      });
  };

  public loadApprovalPosts = () => {
    this.isApprovalPostsLoading = true;

    communityApi
      .getAdminCommunityPosts({
        communityId: this.communityId,
        status: PostStatus.WaitForApproval,
      })
      .then(({ posts }) => {
        this.communityApprovalPosts = posts;
      })
      .finally(() => {
        this.isApprovalPostsLoading = false;
      });
  };

  public changeMemberRole = (
    data: Omit<EditMemberRoleOrStatusDto, 'communityId'>
  ) => {
    this.isChangeMemberRoleLoading = true;

    return communityApi
      .editMemberRoleOrStatus({
        communityId: this.communityId,
        ...data,
      })
      .finally(() => {
        this.isChangeMemberRoleLoading = false;
      });
  };

  public unBlockUser = (communityId: string, userIds: string[]) => {
    this.isUnBlockUserLoading = true;

    return communityApi.unBlockUser(communityId, userIds).finally(() => {
      this.isUnBlockUserLoading = false;
    });
  };

  public removeMember = (userId: string) => {
    this.isRemoveMemberLoading = true;

    return communityApi.removeMember(this.communityId, userId).finally(() => {
      this.isRemoveMemberLoading = false;
    });
  };

  public loadCommentsReports = () => {
    this.isCommentsReportsLoading = true;

    communityApi
      .getCommentsReports({ communityId: this.communityId })
      .then(({ postComments }) => {
        this.commentsReports = postComments;
      })
      .finally(() => {
        this.isCommentsReportsLoading = false;
      });
  };

  public setPostStatus = (postId: string, status: PostStatus) => {
    this.isApprovalOrDeclinePostLoading = true;

    return postApi
      .setStatus(this.communityId, postId, status)
      .then(() => {
        this.loadApprovalPosts();
      })
      .finally(() => {
        this.isApprovalOrDeclinePostLoading = false;
      });
  };

  public loadReportedPosts = () => {
    this.isReportedPostsLoading = true;

    postApi
      .getReportedPosts({ communityId: this.communityId })
      .then(({ posts }) => {
        this.reportedPosts = posts;
      })
      .finally(() => {
        this.isReportedPostsLoading = false;
      });
  };

  public loadArchivedPosts = () => {
    this.isArchivedPostsLoading = true;

    communityApi
      .getAdminCommunityPosts({
        communityId: this.communityId,
        status: PostStatus.ArchivedDueToReported,
      })
      .then(({ posts }) => {
        this.archivedPosts = posts;
      })
      .finally(() => {
        this.isArchivedPostsLoading = false;
      });
  };

  public loadCommunityPostsStatistic = () => {
    this.isCommunityPostsStatisticsLoading = true;

    communityApi
      .getCommunityPostsStatistics(this.communityId)
      .then((res) => {
        this.communityPostsStatistics = res;
      })
      .finally(() => {
        this.isCommunityPostsStatisticsLoading = false;
      });
  };

  public addMembersToCommunity = (usersIds: string[]) => {
    this.isAddMembersLoading = true;

    return communityApi.addMembers(this.communityId, usersIds).finally(() => {
      this.isAddMembersLoading = false;
    });
  };

  public banMembers = async (usersIds: string[], reason: string) => {
    this.isBanMembersLoading = true;
    try {
      await communityApi.blockUser({
        communityId: this.communityId,
        users: usersIds.map((userId) => ({ userId, reason })),
      });
    } finally {
      this.isBanMembersLoading = false;
    }
  };

  public updateReasonBlockingMember = async (
    userId: string,
    reason: string
  ) => {
    this.isBannedMembersLoading = true;

    communityApi
      .updateReasonBlocking({
        communityId: this.communityId,
        userId,
        reason,
      })
      .then(() => {
        this.bannedMembers = (this.bannedMembers ?? [])?.map((member) => {
          if (member.userId === userId) {
            return { ...member, reason };
          }
          return member;
        });
      })
      .finally(() => {
        this.isBannedMembersLoading = false;
      });
  };

  public loadMeetings = () => {
    this.isMeetingsLoading = true;

    communityApi
      .getCommunityMeetingsAdmin({ id: this.communityId })
      .then((res) => {
        this.meetings = res.meets;
        this.meetingsCount = res.totalItemCount;
      })
      .finally(() => {
        this.isMeetingsLoading = false;
      });
  };

  public removeMeeting = async (meetingId: string) => {
    communityApi.removeMeetingAdmin(this.communityId, meetingId).then(() => {
      this.loadMeetings();
    });
  };

  public createMeeting = async (data: CreateMeetingDto): Promise<string> => {
    this.isCreateMeetingLoading = true;

    try {
      const res = await communityApi.createMeetingAdmin(this.communityId, data);
      this.loadMeetings();
      return res;
    } finally {
      this.isCreateMeetingLoading = false;
    }
  };

  public editMeeting = async (data: CreateMeetingDto) => {
    this.isEditMeetingLoading = true;

    try {
      await communityApi.editMeetingAmdin(this.communityId, data);
      this.loadMeetings();
    } finally {
      this.isEditMeetingLoading = false;
    }
  };

  public loadDeletedMembers = () => {
    this.isDeletedMembersLoading = true;

    communityApi
      .getCommunityMembersAdmin({
        id: this.communityId,
        status: [CommunityStatus.Removed],
      })
      .then((res) => {
        this.deletedMembers = res.communityMembers;
        this.deletedMembersCount = res.totalItemCount;
      })
      .finally(() => {
        this.isDeletedMembersLoading = false;
      });
  };

  public unDeleteUser = (userId: string) => {
    this.isUnDeleteLoading = true;

    return communityApi
      .editMemberRoleOrStatus({
        communityId: this.communityId,
        userId: userId,
        status: CommunityStatus.Joined,
      })
      .finally(() => {
        this.isUnDeleteLoading = false;
      });
  };
}
