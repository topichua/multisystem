import { uniq } from 'lodash';
import { action, makeObservable, observable } from 'mobx';
import { UploadAttachment } from 'src/components/common/UploadAttachments/UploadAttachments';
import {
  PermissionDto,
  UserProfileDto,
} from 'src/transport/account/account.dto';
import { communityApi } from 'src/transport/communities/communities.api';
import {
  CommunitiyDto,
  CommunityRole,
} from 'src/transport/communities/communities.dto';

import { postApi } from 'src/transport/posts/posts.api';

import {
  Comment,
  CreateCommentDto,
  EditPostDto,
  Post,
  PostStatus,
} from 'src/transport/posts/posts.dto';
import { userApi } from 'src/transport/user/user.api';

import * as storeUtils from './__helpers/store';

export type CommentsData = Record<string, Comment[]>;
export type UsersData = Record<string, UserProfileDto>;

export class CommunityPostDetailsStore {
  public postId: string;
  public communityAlias: string;
  public postLoading: boolean = true;
  public post: Post | null = null;

  public communityLoading: boolean = true;
  public community: CommunitiyDto | null = null;
  public userRole: CommunityRole | null = null;
  public permissions: PermissionDto | null = null;

  public commentsLoading: boolean = true;
  public comments: CommentsData | null = null;
  public commentsCount: number = 0;
  public commentsUsers: UsersData = {};

  public createdUserLoading: boolean = true;
  public createdUser: UserProfileDto | null = null;
  public createdUserPostCounter: number | null = null;

  public createCommentLoadingId: boolean | string = false; // parent comment id or true
  public editCommentLoadingId: string | null = null;
  public deleteCommentLoading: boolean = false;

  public isReportLoading: boolean = false;
  public isDeletePostLoading: boolean = false;
  public isEditPostLoading: boolean = false;

  public isReportPostLoading: boolean = false;
  public isRestorePostLoading: boolean = false;
  public isOpenPostLoading: boolean = false;

  constructor(postId: string, alias: string) {
    this.postId = postId;
    this.communityAlias = alias;
    makeObservable(this, {
      postLoading: observable,
      post: observable,
      communityLoading: observable,
      community: observable,
      userRole: observable,
      permissions: observable,
      commentsLoading: observable,
      comments: observable,
      commentsCount: observable,
      commentsUsers: observable,
      createdUserLoading: observable,
      createdUser: observable,
      createdUserPostCounter: observable,
      createCommentLoadingId: observable,
      editCommentLoadingId: observable,
      deleteCommentLoading: observable,
      isReportLoading: observable,
      isDeletePostLoading: observable,
      isEditPostLoading: observable,
      isReportPostLoading: observable,
      isRestorePostLoading: observable,
      isOpenPostLoading: observable,
      fetchData: action,
      fetchPost: action,
      fetchCreatedUser: action,
      fetchComments: action,
      createComment: action,
      editComment: action,
      deleteComment: action,
      reportComment: action,
      deletePost: action,
      editPost: action,
      reportPost: action,
      restorePost: action,
      openPost: action,
    });

    this.fetchData();
  }

  public fetchData = async () => {
    await postApi.viewPost(this.postId);
    this.fetchPost();
    this.fetchCommunity();
    this.fetchComments();
  };

  public fetchPost = () => {
    this.postLoading = true;

    postApi
      .getPostById(this.postId)
      .then(({ post }) => {
        this.post = post;
        this.fetchCreatedUser(post.createdByUserId);
      })
      .finally(() => {
        this.postLoading = false;
      });
  };

  public fetchCommunity = () => {
    this.communityLoading = true;

    communityApi
      .getCommunityByAlias(this.communityAlias)
      .then(({ community }) => {
        this.community = community.community;
        this.userRole = community.role;
        this.permissions = community.permissions;
      })
      .finally(() => {
        this.communityLoading = false;
      });
  };

  public fetchCreatedUser = (id: string) => {
    this.createdUserLoading = true;

    userApi
      .getUserById(id)
      .then((res) => {
        this.createdUser = res.data;
      })
      .then(() => {
        postApi.getUserPostCounter(id).then((res) => {
          this.createdUserPostCounter = res;
        });
      })
      .finally(() => {
        this.createdUserLoading = false;
      });
  };

  public fetchComments = async () => {
    this.commentsLoading = true;

    const { postComments } = await postApi
      .getCommentsByPostId(this.postId)
      .then((res) => {
        const comments = storeUtils.groupCommentsByParent(res.postComments);
        this.comments = comments;
        this.commentsCount = res.totalItemCount;
        return res;
      });

    const { data } = await userApi.getUsersByIds({
      accountIds: uniq(
        postComments.map((comments) => comments.createdByUserId)
      ),
    });

    const users = data.users.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {} as UsersData);

    this.commentsUsers = users;
    this.commentsLoading = false;
  };

  public createComment = async (comment: Omit<CreateCommentDto, 'postId'>) => {
    this.createCommentLoadingId = comment?.parentCommentId || true;

    try {
      const { postComment } = await postApi.createComment({
        ...comment,
        postId: this.postId,
      });

      const copiedComments = { ...this.comments };
      const key = postComment.parentCommentId || 'all';

      if (copiedComments[key]) {
        copiedComments[key] = [postComment, ...copiedComments[key]];
      } else {
        copiedComments[key] = [postComment];
      }

      if (!this.commentsUsers[postComment.createdByUserId]) {
        const { data: newUser } = await userApi.getUserById(
          postComment.createdByUserId
        );
        this.commentsUsers = { ...this.commentsUsers, [newUser.id]: newUser };
      }

      this.comments = copiedComments;
      this.commentsCount += 1;
    } finally {
      this.createCommentLoadingId = false;
    }
  };

  public editComment = (
    id: string,
    body: string,
    files: UploadAttachment[]
  ) => {
    this.editCommentLoadingId = id;

    return postApi
      .editComment({ postId: this.postId, commentId: id, body, files })
      .then(() => {
        if (!this.comments) return;

        this.comments = storeUtils.updateCommentBody(id, body, this.comments);
        this.fetchComments();
      })
      .finally(() => {
        this.editCommentLoadingId = null;
      });
  };

  public likePost = () => {
    postApi.likePost(this.postId); // TODO: should change in this.post
  };

  public dislikePost = () => {
    postApi.dislikePost(this.postId); // TODO: should change in this.post
  };

  public likeComment = (id: string) => {
    postApi.likeComment(id, this.postId); // TODO: should change in this.comments
  };

  public dislikeComment = (id: string) => {
    postApi.dislikeComment(id, this.postId); // TODO: should change in this.comments
  };

  public savePost = () => {
    postApi.savePost(this.postId); // TODO: should change in this.post
  };

  public unSavePost = () => {
    postApi.unSavePost(this.postId); // TODO: should change in this.post
  };

  public deleteComment = (id: string, commentParentId: string | null) => {
    this.deleteCommentLoading = true;

    return postApi
      .deleteComment(id, this.postId)
      .then(() => {
        if (!this.comments) return;

        const { updatedComments, deletedCount } =
          storeUtils.deleteCommentAndChildren(
            id,
            commentParentId,
            this.comments
          );

        this.comments = updatedComments;
        this.commentsCount -= deletedCount;
      })
      .finally(() => {
        this.deleteCommentLoading = false;
      });
  };

  public reportComment = (
    postId: string,
    commentId: string,
    message: string
  ) => {
    this.isReportLoading = true;

    return postApi.reportComment({ postId, commentId, message }).finally(() => {
      this.isReportLoading = false;
    });
  };

  public deletePost = () => {
    this.isDeletePostLoading = true;

    return postApi.deletePost(this.postId).finally(() => {
      this.isDeletePostLoading = false;
    });
  };

  public editPost = (data: EditPostDto, tags: string[]) => {
    this.isEditPostLoading = true;

    return Promise.all([
      postApi.editPost(data),
      postApi.setTagsToPost(this.postId, tags),
    ])
      .then(() => {
        this.fetchPost();
      })
      .finally(() => {
        this.isEditPostLoading = false;
      });
  };

  public reportPost = (report: string) => {
    this.isReportPostLoading = true;

    return postApi.report(this.postId, report).finally(() => {
      this.isReportPostLoading = false;
    });
  };

  public restorePost = () => {
    this.isRestorePostLoading = true;

    return postApi
      .setStatus(this.community?.id || '', this.postId, PostStatus.Published)
      .then(() => {
        if (this.post) {
          this.post = { ...this.post, status: PostStatus.Published };
        }
      })
      .finally(() => {
        this.isRestorePostLoading = false;
      });
  };

  public openPost = () => {
    this.isOpenPostLoading = true;

    return postApi
      .editPost({ id: this.postId, isFrozen: false })
      .then(() => {
        if (this.post) {
          this.post = { ...this.post, isFrozen: false };
        }
      })
      .finally(() => {
        this.isOpenPostLoading = false;
      });
  };
}
