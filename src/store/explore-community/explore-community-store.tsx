import { UploadFile } from 'antd';
import { action, makeObservable, observable } from 'mobx';

import { EngagementAction } from 'src/hooks/useEngagementTracker/types';
import { JoinQuestionsFormValues } from 'src/pages/explore-community/components/Content/QuestionsModal';
import { communityApi } from 'src/transport/communities/communities.api';
import {
  CommunitiyCategoryDto,
  CommunityStatus,
  CommunityUser,
} from 'src/transport/communities/communities.dto';
import { engagementApi } from 'src/transport/engagement/engagement.api.ts';
import { ParentCategory, parseCategories } from 'src/utils/parseCategories.ts';

export class ExploreCommunityStore {
  public isCommunityLoading: boolean = false;
  public allCommunities: CommunityUser[] = [];
  public joinUnJoinCommunityLoadingId: string | null = null;

  public isCategoryLoading: boolean = false;
  public initCategories: ParentCategory[] = [];
  public checkedCategoriesParents: ParentCategory[] = [];
  public checkedCategoriesChildren: Record<string, CommunitiyCategoryDto[]> =
    {};

  public isFavourited: boolean = false;
  public isOnlyJoined: boolean = false;
  public joinedCount: number = 0;

  constructor() {
    makeObservable(this, {
      isCommunityLoading: observable,
      allCommunities: observable,
      initCategories: observable,
      isCategoryLoading: observable,
      checkedCategoriesParents: observable,
      checkedCategoriesChildren: observable,
      isFavourited: observable,
      joinUnJoinCommunityLoadingId: observable,
      isOnlyJoined: observable,
      joinedCount: observable,

      toogleFavourited: action,
      getAllCategories: action,
      setCheckedCategoriesParents: action,
      setCheckedCategoriesChildren: action,
      getAllCommunities: action,
      addCommunityToFavorite: action.bound,
      removeCommunityFromFavorite: action.bound,
      addLikeToCommunity: action.bound,
      removeLikeFromCommunity: action.bound,
      follow: action.bound,
      unfollow: action.bound,
      toogleOnlyJoined: action,
      setOnlyJoined: action,
      setOnlyFavourited: action,
      loadPreference: action,
    });
    this.loadPreference();
  }

  public getAllCommunities = async () => {
    this.isCommunityLoading = true;

    const parentIds = this.checkedCategoriesParents.map((parent) => parent.id);

    const childIds = Object.values(this.checkedCategoriesChildren).flatMap(
      (children) => children.map((child) => child.id)
    );

    const allIds = [...new Set([...parentIds, ...childIds])];

    communityApi
      .getCommunitiesList({
        onlyFavorite: this.isFavourited,
        onlyJoined: this.isOnlyJoined,
        ...(allIds.length > 0 ? { categoryIds: allIds } : {}),
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

  public getAllCategories = async () => {
    this.isCategoryLoading = true;
    communityApi
      .getAllCategoriesPublic()
      .then((resp) => {
        this.initCategories = parseCategories(resp.communityCategories);
      })
      .catch((error) => {
        throw new Error(error);
      })
      .finally(() => {
        this.isCategoryLoading = false;
      });
  };

  public setCheckedCategoriesParents = (parents: ParentCategory[]) => {
    this.checkedCategoriesParents = parents;
  };

  public setCheckedCategoriesChildren = (
    children: Record<string, CommunitiyCategoryDto[]>
  ) => {
    this.checkedCategoriesChildren = children;
  };

  public toogleFavourited = () => {
    this.isFavourited = !this.isFavourited;
  };

  public setOnlyFavourited = (setOnlyFavourited: boolean) => {
    this.isFavourited = setOnlyFavourited;
  };

  public toogleOnlyJoined = () => {
    this.isOnlyJoined = !this.isOnlyJoined;
  };

  public setOnlyJoined = (setOnlyJoined: boolean) => {
    this.isOnlyJoined = setOnlyJoined;
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

  public async follow(
    id: string,
    name: string,
    answers?: JoinQuestionsFormValues
  ) {
    this.joinUnJoinCommunityLoadingId = id;
    const userAnswers = answers?.questions.map((answer) => ({
      questionId: answer.questionId,
      answer: answer.answer,
    }));

    return communityApi
      .joinCommunity(id, userAnswers)
      .then(() => {
        const answerFiles = answers?.questions.reduce(
          (acc, current) => {
            if (current.file.length > 0) {
              return [
                ...acc,
                { questionId: current.questionId, files: current.file },
              ];
            }
            return acc;
          },
          [] as Array<{ questionId: string; files: Array<UploadFile> }>
        );

        if (answerFiles && answerFiles?.length > 0) {
          return Promise.all(
            answerFiles.map((answer) =>
              communityApi.joinCommunitySendAnswerFiles(
                id,
                answer.questionId,
                answer.files
              )
            )
          );
        }
      })
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
        this.loadPreference();
      })
      .then(() => {
        engagementApi.trackEngagement({
          action: EngagementAction.JoinCommunity,
          entityId: id,
          entityName: name,
          entityUrl: window.location.href,
        });
      })
      .catch((e) => {
        communityApi.cancelJoinCommunity(id);
        throw e;
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
        this.loadPreference();
      })
      .finally(() => {
        this.joinUnJoinCommunityLoadingId = null;
      });
  }

  public async loadPreference() {
    return communityApi.getPreference().then(({ joinedCount }) => {
      this.joinedCount = joinedCount;
    });
  }
}
