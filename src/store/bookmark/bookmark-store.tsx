import { action, makeObservable, observable } from 'mobx';
import { EngagementAction } from 'src/hooks/useEngagementTracker/types.ts';

import { communityApi } from 'src/transport/communities/communities.api';
import {
  CommunityStatus,
  CommunityUser,
  ExploreMeetStatus,
  MeetingCommunityItem,
} from 'src/transport/communities/communities.dto';
import { engagementApi } from 'src/transport/engagement/engagement.api.ts';

export class BookmarkStore {
  public isMeetingsLoading: boolean = false;
  public updateMeetingStatusLoading: boolean = false;
  public meetings: ExploreMeetStatus[] = [];
  public allMeetingsCommunities: MeetingCommunityItem[] = [];

  public isCommunityLoading: boolean = false;
  public allCommunities: CommunityUser[] = [];
  public joinUnJoinCommunityLoadingId: string | null = null;

  constructor() {
    makeObservable(this, {
      isCommunityLoading: observable,
      allCommunities: observable,
      joinUnJoinCommunityLoadingId: observable,
      updateMeetingStatusLoading: observable,
      isMeetingsLoading: observable,
      meetings: observable,

      getAllMeetings: action,
      getAllCommunities: action,
      updateMeetingStatus: action,
      addCommunityToFavorite: action.bound,
      removeCommunityFromFavorite: action.bound,
      addLikeToCommunity: action.bound,
      removeLikeFromCommunity: action.bound,
      follow: action.bound,
      unfollow: action.bound,
    });
  }

  public getAllCommunities = async () => {
    this.isCommunityLoading = true;

    communityApi
      .getCommunitiesList({
        onlyFavorite: true,
      })
      .then((resp) => {
        this.allCommunities = resp.communities;
      })
      .catch((error) => {
        throw new Error(error);
      })
      .finally(() => {
        this.isCommunityLoading = false;
      });
  };

  public async addCommunityToFavorite(communityId: string) {
    return communityApi.addToFavorite(communityId).then(() => {
      this.allCommunities = this.allCommunities
        ? this.allCommunities?.map((community) => ({
            ...community,
            community: {
              ...community.community,
              isFavorite:
                communityId === community.community.id
                  ? true
                  : community.community.isFavorite,
            },
          }))
        : [];
    });
  }

  public async removeCommunityFromFavorite(communityId: string) {
    return communityApi.removeFromFavorite(communityId).then(() => {
      this.allCommunities = this.allCommunities
        ? this.allCommunities.map((community) => ({
            ...community,
            community: {
              ...community.community,
              isFavorite:
                communityId === community.community.id
                  ? false
                  : community.community.isFavorite,
            },
          }))
        : [];
    });
  }

  public addLikeToCommunity = async (communityId: string) => {
    return communityApi.addLikeToCommunity(communityId).then(() => {
      this.allCommunities = this.allCommunities
        ? this.allCommunities.map((community) => ({
            ...community,
            community: {
              ...community.community,
              likesCount:
                communityId === community.community.id
                  ? community.community.likesCount + 1
                  : community.community.likesCount,
              isLiked:
                communityId === community.community.id
                  ? true
                  : community.community.isLiked,
            },
          }))
        : [];
    });
  };

  public removeLikeFromCommunity = async (communityId: string) => {
    return communityApi.removeLikeFromCommunity(communityId).then(() => {
      this.allCommunities = this.allCommunities
        ? this.allCommunities.map((community) => ({
            ...community,
            community: {
              ...community.community,
              likesCount:
                communityId === community.community.id
                  ? community.community.likesCount - 1
                  : community.community.likesCount,

              isLiked:
                communityId === community.community.id
                  ? false
                  : community.community.isLiked,
            },
          }))
        : [];
    });
  };

  public async follow(id: string, name: string) {
    this.joinUnJoinCommunityLoadingId = id;
    return communityApi
      .joinCommunity(id)
      .then(() => {
        this.allCommunities = this.allCommunities
          ? this.allCommunities.map((community) => {
              const isJoinedCommunity = community.community.id === id;
              const updatedStatus = community.community.isPublic
                ? CommunityStatus.Joined
                : CommunityStatus.Awaiting;

              return {
                ...community,
                status: isJoinedCommunity ? updatedStatus : community.status,
              };
            })
          : [];
      })
      .then(() => {
        engagementApi.trackEngagement({
          action: EngagementAction.JoinCommunity,
          entityId: id,
          entityName: name,
          entityUrl: window.location.href,
        });
      })
      .finally(() => {
        this.joinUnJoinCommunityLoadingId = null;
      });
  }

  public async unfollow(id: string) {
    this.joinUnJoinCommunityLoadingId = id;

    return communityApi
      .unJoinCommunity(id)
      .then(() => {
        this.allCommunities = this.allCommunities
          ? this.allCommunities.map((community) => ({
              ...community,
              status: community.community.id === id ? null : community.status,
            }))
          : [];
      })
      .finally(() => {
        this.joinUnJoinCommunityLoadingId = null;
      });
  }

  public getAllMeetings = async () => {
    this.isMeetingsLoading = true;

    communityApi
      .getExploreMeetings({
        page: 1,
        pageSize: 1000,
        onlyFavorite: true,
        showPast: true,
        showUpcoming: true,
      })
      .then((res) => {
        this.meetings = res.meets;
      })
      .then(() => {
        communityApi.getMeetingPreference().then((resp) => {
          this.allMeetingsCommunities = resp.communities;
        });
      })
      .finally(() => {
        this.isMeetingsLoading = false;
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
        this.getAllMeetings();
      })
      .finally(() => {
        this.updateMeetingStatusLoading = false;
      });
  };
}
