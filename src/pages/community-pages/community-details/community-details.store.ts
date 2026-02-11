import { AxiosError } from 'axios';
import { action, makeObservable, observable } from 'mobx';
import { EngagementAction } from 'src/hooks/useEngagementTracker/types.ts';
import { PermissionDto } from 'src/transport/account/account.dto';

import { communityApi } from 'src/transport/communities/communities.api';
import {
  CommunitiyDto,
  CommunityAssetsFolder,
  CommunityAssetsItem,
  CommunityMember,
  CommunityRole,
  CommunityStatus,
  MeetStatus,
} from 'src/transport/communities/communities.dto';
import { communityAssetsApi } from 'src/transport/communities/community.assets.api';
import { engagementApi } from 'src/transport/engagement/engagement.api.ts';
import { postApi } from 'src/transport/posts/posts.api';
import { CreatePostDto, Post } from 'src/transport/posts/posts.dto';

export class CommunityDetailsStore {
  public loading: boolean = false;
  public community: CommunitiyDto | null = null;
  public status: CommunityStatus | null = null;
  public role: CommunityRole | null = null;
  public permissions: PermissionDto | null = null;
  public communityId: string = '';
  public communityAlias: string;

  public communityFetchError: {
    message?: string;
    statusCode: number | undefined;
  } | null = null;

  public isAboutLoading: boolean = false;
  public about: string | null = null;

  public postsLoading: boolean = false;
  public posts: Post[] | null = null;
  public totalPosts: number | null = null;

  public members: CommunityMember[] | null = null;
  public membersLoading: boolean = false;
  public totalMembers: number | null = null;

  public meetings: MeetStatus[] | null = null;
  public meetingsLoading: boolean = false;
  public updateMeetingStatusLoading: boolean = false;

  public folders: CommunityAssetsFolder[] = [];
  public assetsItems: Record<string, CommunityAssetsItem[]> | null = null;
  public assetsLoading: boolean = false;

  public createPostLoading: boolean = false;
  public isLiked: boolean = false;
  public likesCount: number = 0;
  public joinedAt: Date | null = null;

  constructor(alias: string) {
    this.communityAlias = alias;
    makeObservable(this, {
      community: observable,
      loading: observable,
      isAboutLoading: observable,
      about: observable,
      status: observable,
      permissions: observable,
      postsLoading: observable,
      posts: observable,
      totalPosts: observable,
      createPostLoading: observable,
      isLiked: observable,
      likesCount: observable,
      members: observable,
      membersLoading: observable,
      totalMembers: observable,
      folders: observable,
      assetsItems: observable,
      assetsLoading: observable,
      meetings: observable,
      meetingsLoading: observable,
      updateMeetingStatusLoading: observable,
      communityId: observable,

      fetchCommunity: action,
      getCommunityIdByAlias: action,
      fetchMembers: action,
      fetchPosts: action,
      fetchFoldersAndItems: action,
      fetchCommunityAbout: action,
      createPost: action,
      setStatus: action.bound,
      fetchMeetings: action,
      updateMeetingStatus: action,
      addLikeToCommunity: action,
      removeLikeFromCommunity: action,
      communityFetchError: observable,
      joinedAt: observable,
    });
    this.getCommunityIdByAlias();
  }

  public getCommunityIdByAlias() {
    this.loading = true;
    communityApi
      .getCommunityByAlias(this.communityAlias)
      .then(({ community }) => {
        this.communityId = community.community.id;
        this.fetchCommunity();
      })
      .catch((e: AxiosError) => {
        this.communityFetchError = {
          message: e?.message,
          statusCode: e?.status,
        };
      });
  }

  public fetchCommunity = () => {
    this.loading = true;
    this.communityFetchError = null;
    communityApi
      .getCommunityById(this.communityId)
      .then(({ community }) => {
        this.community = community.community;
        this.status = community.status;
        this.permissions = community.permissions;
        this.joinedAt = community.joinedAt;
        this.likesCount = community.community.likesCount;
        this.isLiked = community.community.isLiked;
      })
      .then(() => {
        communityApi.viewCommunity(this.communityId);
        engagementApi.trackEngagement({
          action: EngagementAction.ViewCommunity,
          entityId: this.communityId,
          entityName: this.community?.name || '',
          entityUrl: window.location.href,
        });
      })
      .catch((e: AxiosError) => {
        this.communityFetchError = {
          message: e?.message,
          statusCode: e?.status,
        };
      })
      .finally(() => {
        this.loading = false;
      });
  };

  public fetchPosts = () => {
    this.postsLoading = true;

    communityApi
      .getCommunityPosts({
        id: this.communityId,
      })
      .then((res) => {
        this.posts = res.posts;
        this.totalPosts = res.totalItemCount;
      })
      .finally(() => {
        this.postsLoading = false;
      });
  };

  public fetchCommunityAbout = () => {
    this.isAboutLoading = true;

    communityApi
      .getCommunityAbout(this.communityId)
      .then((resp) => {
        this.about = resp;
      })
      .finally(() => {
        this.isAboutLoading = false;
      });
  };

  public fetchMembers = () => {
    this.membersLoading = true;

    communityApi
      .getCommunityMembers({ id: this.communityId })
      .then((res) => {
        this.members = res.communityMembers;
        this.totalMembers = res.totalItemCount;
      })
      .finally(() => {
        this.membersLoading = false;
      });
  };

  public fetchMeetings = () => {
    this.meetingsLoading = true;

    communityApi
      .getCommunityMeetings({ id: this.communityId })
      .then((res) => {
        this.meetings = res.meets;
      })
      .finally(() => {
        this.meetingsLoading = false;
      });
  };

  public updateMeetingStatus = async (
    communityId: string,
    meetingId: string,
    newStatus: string
  ) => {
    this.updateMeetingStatusLoading = true;

    communityApi
      .updateMeetingStatus(communityId, meetingId, newStatus)
      .then(() => {
        this.fetchMeetings();
      })
      .finally(() => {
        this.updateMeetingStatusLoading = false;
      });
  };

  public createPost = async (post: CreatePostDto): Promise<Post> => {
    this.createPostLoading = true;

    return await postApi
      .createPost(post)
      .then(({ post }) => {
        this.fetchPosts();
        return post;
      })
      .finally(() => {
        this.createPostLoading = false;
      });
  };

  public setStatus = (status: CommunityStatus | null) => {
    this.status = status;
  };

  public fetchFoldersAndItems = async () => {
    this.assetsLoading = true;

    const { folders } = await communityAssetsApi.getCommunityAssetsFolders(
      this.communityId
    );

    const foldersAssets = await Promise.all(
      folders.map((folder) =>
        communityAssetsApi.getCommunityAssetsItems(this.communityId, folder.id)
      )
    );

    const itemsMap = folders.reduce(
      (acc, folder, index) => {
        acc[folder.id] = foldersAssets[index].assets as CommunityAssetsItem[];
        return acc;
      },
      {} as { [key: string]: CommunityAssetsItem[] }
    );

    this.folders = folders;
    this.assetsItems = itemsMap;

    this.assetsLoading = false;
  };

  public addLikeToCommunity = () => {
    communityApi.addLikeToCommunity(this.communityId).then(() => {
      this.isLiked = true;
      this.likesCount += 1;
    });
  };

  public removeLikeFromCommunity = () => {
    communityApi.removeLikeFromCommunity(this.communityId).then(() => {
      this.isLiked = false;
      this.likesCount -= 1;
    });
  };
}
