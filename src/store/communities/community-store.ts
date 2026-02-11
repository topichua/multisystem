import { action, makeObservable, observable } from 'mobx';
import { EngagementAction } from 'src/hooks/useEngagementTracker/types.ts';

import { communityApi } from 'src/transport/communities/communities.api';
import {
  CommunitiesPreference,
  CommunitiyCategoryDto,
  CommunitiyDto,
  CommunityStatus,
  CommunityUser,
} from 'src/transport/communities/communities.dto';
import { engagementApi } from 'src/transport/engagement/engagement.api.ts';

export class CommunityStore {
  public isCommunityLoading: boolean = false;
  public isCategoryLoading: boolean = false;

  public community: CommunitiyDto | null = null;

  public allCommunities: CommunityUser[] | null = null;
  public allCategories: CommunitiyCategoryDto[] | null = null;
  public selectedTagIds: string[] = [];
  public processingIds: string[] = [];

  public joinUnJoinCommunityLoadingId: string | null = null;

  public preference: CommunitiesPreference | null = null;
  public preferenceLoading: boolean = false;

  public favourites: CommunitiyDto[] = [];
  public favouritesLoading: boolean = false;

  constructor() {
    makeObservable(this, {
      isCommunityLoading: observable,
      isCategoryLoading: observable,
      community: observable,
      allCommunities: observable,
      allCategories: observable,
      selectedTagIds: observable,
      joinUnJoinCommunityLoadingId: observable,
      preference: observable,
      preferenceLoading: observable,
      getAllCommunities: action,
      getAllCategories: action,
      setSelectedTagId: action,
      processingIds: observable,
      favourites: observable,
      favouritesLoading: observable,

      getCommunitiesByTag: action,
      follow: action.bound,
      unfollow: action.bound,
      addCommunityToFavorite: action.bound,
      removeCommunityFromFavorite: action.bound,
      loadPreference: action.bound,
      loadFavourites: action.bound,
    });
    this.loadPreference();
    this.loadFavourites();
  }

  public loadPreference = () => {
    this.preferenceLoading = true;

    communityApi
      .getPreference()
      .then((res) => {
        this.preference = res;
      })
      .finally(() => {
        this.preferenceLoading = false;
      });
  };

  public loadFavourites = () => {
    this.favouritesLoading = true;

    communityApi
      .getFavourites()
      .then((res) => {
        this.favourites = res.communities.map(
          (community) => community.community
        );
      })
      .finally(() => {
        this.favouritesLoading = false;
      });
  };

  public getAllCategories = async () => {
    this.isCategoryLoading = true;
    communityApi
      .getAllCategoriesPublic()
      .then((resp) => {
        this.allCategories = resp.communityCategories;
      })
      .catch((error) => {
        throw new Error(error);
      })
      .finally(() => {
        this.isCategoryLoading = false;
      });
  };

  public getAllCommunities = async () => {
    this.isCommunityLoading = true;

    communityApi
      .getCommunitiesList({})
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

  public setSelectedTagId = () => {};

  public getCommunitiesByTag = () => {};

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

  public async addCommunityToFavorite(communityId: string) {
    return communityApi.addToFavorite(communityId).then(() => {
      this.allCommunities = this.allCommunities
        ? this.allCommunities.map((community) => ({
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
}
