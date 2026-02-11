import { ActionStatusEnum } from 'src/components/common/UploadAttachments/UploadAttachments';
import axio2s from '../axios/axios-instance';
import { PaginationResponse } from '../types';

import {
  CreatePostDto,
  FetchPostsFeedDto,
  Comment,
  CreateCommentDto,
  Post,
  ReportCommentDto,
  EditPostDto,
  PostStatus,
  GetReportedPostsDto,
  EditCommentDto,
} from './posts.dto';

export const postApi = {
  async createPost({
    imageFile,
    files,
    ...restPost
  }: CreatePostDto): Promise<{ post: Post }> {
    const fd = new FormData();

    if (imageFile?.originFileObj) {
      fd.append('imageFile', imageFile.originFileObj);
    }

    if (files?.length) {
      files.forEach((file) => {
        if (file?.originFileObj) {
          fd.append(`files`, file.originFileObj, file.originFileObj.name);
        }
      });
    }

    for (const key in restPost) {
      const value = restPost[key as keyof typeof restPost];

      if (value) {
        fd.append(key, value.toString());
      }
    }

    return await axio2s.post('api/v1/community/post', fd);
  },

  async getPostById(id: string): Promise<{ post: Post }> {
    const match = id.match(/mock-post-(\d+)/);
    if (match) {
      const i = Number(match[1]);
      const now = Date.now();
      const isSaved = i % 3 === 0;
      const isLiked = i % 5 === 0;
      const post: Post = {
        id,
        communityId: `community-${(i % 5) + 1}`,
        title: `Mock Post Title ${i}`,
        body: `This is a mocked post body for item ${i}. It exists to help exercise pagination and "load more" behavior in the feed.`,
        createdAt: new Date(now - i * 3600_000),
        updatedAt: new Date(now - (i - 1) * 1800_000),
        status: PostStatus.Published,
        createdByUserId: `user-${(i % 7) + 1}`,
        isFrozen: false,
        imageUrl:
          i % 4 === 0 ? `https://picsum.photos/seed/mock-${i}/600/400` : undefined,
        likesCount: i * 2,
        viewsCount: i * 10,
        commentsCount: i % 6,
        isLiked,
        isSaved,
        tags: [{ id: `tag-${(i % 3) + 1}`, name: `Tag ${(i % 3) + 1}` }],
      };
      return Promise.resolve({ post });
    }
    return await axio2s.get(`api/v1/community/post/${id}`);
  },

  async getCommentsByPostId(
    id: string,
    page: number = 1,
    pageSize = 1000
  ): Promise<PaginationResponse<{ postComments: Comment[] }>> {
    // Mock comments deterministically based on postId and align user ids with existing mocks
    // Derive community from mocked posts feed mapping: community-{(i % 5) + 1}
    const match = id.match(/mock-post-(\d+)/);
    const idx = match ? Number(match[1]) : 1;
    const communityId = `community-${((idx - 1) % 20) + 1}`;
    const now = Date.now();

    // Create a set of root comments and replies
    const totalRoot = (idx % 4) + 3; // 3..6 roots
    const comments: Comment[] = [];

    for (let r = 1; r <= totalRoot; r++) {
      const rootId = `c-${id}-r${r}`;
      const creatorNum = ((idx + r) % 7) + 1;
      comments.push({
        id: rootId,
        body: `This is a mocked root comment ${r} for ${id} in ${communityId}.`,
        parentCommentId: null,
        createdByUserId: `user-${creatorNum}`,
        createdAt: new Date(now - (idx + r) * 3600_000),
        updatedAt: new Date(now - (idx + r - 1) * 3500_000),
        postId: id,
        likesCount: (idx + r) % 10,
        isLiked: (idx + r) % 5 === 0,
        reports: [],
        attachments:
          r % 4 === 0
            ? [
                {
                  path: `https://picsum.photos/seed/${rootId}/200/150`,
                  name: `mock-attachment-${rootId}.jpg`,
                  type: 'image/jpeg',
                },
              ]
            : undefined,
      });

      // Replies per root
      const replies = (idx + r) % 3; // 0..2 replies
      for (let a = 1; a <= replies; a++) {
        const replyId = `c-${id}-r${r}-a${a}`;
        const replyCreatorNum = ((idx + r + a) % 7) + 1;
        comments.push({
          id: replyId,
          body: `Reply ${a} to root ${r} for ${id}.`,
          parentCommentId: rootId,
          createdByUserId: `user-${replyCreatorNum}`,
          createdAt: new Date(now - (idx + r + a) * 3300_000),
          updatedAt: new Date(now - (idx + r + a - 1) * 3200_000),
          postId: id,
          likesCount: (idx + r + a) % 6,
          isLiked: (idx + r + a) % 4 === 0,
          reports: [],
          attachments: undefined,
        });
      }
    }

    // Stable ordering: newest first by createdAt
    comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Pagination
    const start = (page - 1) * pageSize;
    const pageItems = comments.slice(start, start + pageSize);

    return {
      postComments: pageItems,
      args: { page, pageSize },
      totalItemCount: comments.length,
    };
  },

  async deletePost(id: string) {
    return await axio2s.delete(`api/v1/community/post/${id}`);
  },

  async editPost({ id, imageFile, files, ...restPost }: EditPostDto) {
    const fd = new FormData();

    if (imageFile?.originFileObj) {
      fd.append('imageFile', imageFile.originFileObj);
    }

    const filesForDelete = files?.filter(
      (file) => file.actionStatus === ActionStatusEnum.Deleted
    );
    const filesToCreate = files?.filter(
      (file) => file.actionStatus === ActionStatusEnum.Added
    );

    if (filesForDelete?.length) {
      filesForDelete.forEach((file) => {
        fd.append('attachmentsUrls', file.url as string);
      });
    }
    if (filesToCreate?.length) {
      filesToCreate.map((file) => {
        if (file?.originFileObj) {
          fd.append(`files`, file.originFileObj, file.originFileObj.name);
        }
      });
    }

    for (const key in restPost) {
      const value = restPost[key as keyof typeof restPost];

      if (value !== null && value !== undefined) {
        fd.append(key, value.toString());
      }
    }

    return await axio2s.put(`api/v1/community/post/${id}`, fd);
  },

  async createComment({
    postId,
    files,
    ...comment
  }: CreateCommentDto): Promise<{ postComment: Comment }> {
    const fd = new FormData();

    if (files.length > 0) {
      files.forEach((file) => {
        if (file.originFileObj) {
          fd.append('files', file.originFileObj, file.fileName);
        }
      });
    }

    for (const key in comment) {
      const value = comment[key as keyof typeof comment];

      if (value) {
        fd.append(key, value.toString());
      }
    }

    return await axio2s.post(`api/v1/community/post/${postId}/comment`, fd);
  },

  async editComment({ postId, files, commentId, body }: EditCommentDto) {
    const fd = new FormData();

    fd.append('body', body);

    const filesForDelete = files?.filter(
      (file) => file.actionStatus === ActionStatusEnum.Deleted
    );
    const filesToCreate = files?.filter(
      (file) => file.actionStatus === ActionStatusEnum.Added
    );

    if (filesForDelete?.length) {
      filesForDelete.forEach((file) => {
        fd.append('attachmentsUrls', file.url as string);
      });
    }
    if (filesToCreate?.length) {
      filesToCreate.map((file) => {
        if (file?.originFileObj) {
          fd.append(`files`, file.originFileObj, file.originFileObj.name);
        }
      });
    }

    return await axio2s.put(
      `api/v1/community/post/${postId}/comment/${commentId}`,
      fd
    );
  },

  async viewPost(_id: string) {
    return Promise.resolve(null);
   // return await axio2s.post(`api/v1/community/post/${id}/view`);
  },

  async likePost(id: string) {
    return await axio2s.post(`api/v1/community/post/${id}/like`);
  },

  async dislikePost(id: string) {
    return await axio2s.post(`api/v1/community/post/${id}/dislike`);
  },

  async likeComment(commentId: string, postId: string) {
    return await axio2s.post(
      `api/v1/community/post/${postId}/comment/${commentId}/like`
    );
  },

  async dislikeComment(commentId: string, postId: string) {
    return await axio2s.post(
      `api/v1/community/post/${postId}/comment/${commentId}/dislike`
    );
  },

  async savePost(id: string) {
    return await axio2s.post(`api/v1/community/post/${id}/save`);
  },

  async unSavePost(id: string) {
    return await axio2s.post(`api/v1/community/post/${id}/unsave`);
  },

  async deleteComment(commentId: string, postId: string) {
    return await axio2s.delete(
      `api/v1/community/post/${postId}/comment/${commentId}`
    );
  },

  async fetchPostsFeed({
    page = 1,
    pageSize = 20,
    includeOnlySaved = false,
  }: FetchPostsFeedDto): Promise<PaginationResponse<{ posts: Post[] }>> {
    const totalMockCount = 400; // provide more posts across all 20 communities
    const now = 1735689600000; // fixed base for stable timestamps (2025-01-01)

    const allPosts: Post[] = Array.from({ length: totalMockCount }, (_, idx) => {
      const i = idx + 1;
      const isSaved = i % 3 === 0;
      const isLiked = i % 5 === 0;

      return {
        id: `mock-post-${i}`,
        communityId: `community-${((i - 1) % 20) + 1}`,
        title: `Mock Post Title ${i}`,
        body: `This is a mocked post body for item ${i}. It exists to help exercise pagination and "load more" behavior in the feed.`,
        createdAt: new Date(now - i * 3600_000),
        updatedAt: new Date(now - (i - 1) * 1800_000),
        status: PostStatus.Published,
        createdByUserId: `user-${(i % 7) + 1}`,
        isFrozen: false,
        imageUrl: i % 4 === 0 ? `https://picsum.photos/seed/mock-${i}/600/400` : undefined,
        likesCount: i * 2,
        viewsCount: i * 10,
        commentsCount: i % 6,
        isLiked,
        isSaved,
        tags: [{ id: `tag-${(i % 3) + 1}`, name: `Tag ${(i % 3) + 1}` }],
      };
    });

    const filtered = includeOnlySaved ? allPosts.filter((p) => p.isSaved) : allPosts;
    const start = (page - 1) * pageSize;
    const pagedPosts = filtered.slice(start, start + pageSize);

    return {
      posts: pagedPosts,
      args: { page, pageSize },
      totalItemCount: filtered.length,
    };
  },

  async setTagsToPost(postId: string, tagsIds: string[]) {
    return await axio2s.put(`api/v1/community/post/${postId}/set-tags`, {
      tagIds: tagsIds,
    });
  },

  async reportComment({ postId, commentId, message }: ReportCommentDto) {
    return await axio2s.post(
      `api/v1/community/post/${postId}/comment/${commentId}/report`,
      { message }
    );
  },

  async setStatus(communityId: string, postId: string, status: PostStatus) {
    return await axio2s.post(
      `api/v1/admin/community/${communityId}/post/${postId}/set-status`,
      status,
      { headers: { 'Content-Type': 'application/json' } }
    );
  },

  async report(postId: string, message: string) {
    return await axio2s.post(`api/v1/community/post/${postId}/report`, {
      message,
    });
  },

  async declineReports(communityId: string, reportsIds: string[]) {
    return await axio2s.delete(
      `api/v1/admin/community/${communityId}/post/report`,
      { data: reportsIds }
    );
  },

  async getReportedPosts({
    communityId,
    page = 1,
    pageSize = 1000,
  }: GetReportedPostsDto): Promise<PaginationResponse<{ posts: Post[] }>> {
    return await axio2s.get(
      `api/v1/admin/community/${communityId}/post/report?page=${page}&pageSize=${pageSize}`
    );
  },

  async getUserPostCounter(userId: string): Promise<number> {
    return await axio2s.get(`/api/v1/community/users/${userId}/post-counter`);
  },
};
