import { useBoolean } from 'ahooks';
import { notification } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { postApi } from 'src/transport/posts/posts.api';
import { Post } from 'src/transport/posts/posts.dto';
import { useGetCommunitiesByIds } from './useGetCommunitiesByIds';

import { useGetUsersByIds } from './useGetUsersByIds';

const PAGE_SIZE = 20;

export const usePostsFeed = (includeOnlySaved = false) => {
  const [page, setPage] = useState(1);
  const [postsCount, setPostsCount] = useState<null | number>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const usersIds = useMemo(() => {
    return posts.map((post) => post.createdByUserId);
  }, [posts]);

  const communitiesIds = useMemo(() => {
    return posts.map((post) => post.communityId);
  }, [posts]);

  const { isLoading: isUsersLoading, users } = useGetUsersByIds(usersIds);
  const { isLoading: isCommunitiesLoading, communities } =
    useGetCommunitiesByIds(communitiesIds);

  const [isLoading, { setFalse: finishLoading, setTrue: startLoading }] =
    useBoolean(false);
  const [
    isReportPostLoading,
    { setFalse: finishReportPostLoading, setTrue: startReportPostLoading },
  ] = useBoolean(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    if (!canLoadMore || isLoading) return;

    startLoading();

    const { posts: newPosts, totalItemCount } = await postApi.fetchPostsFeed({
      page,
      pageSize: PAGE_SIZE,
      includeOnlySaved,
    });

    setPosts([...posts, ...newPosts]);
    setPostsCount(totalItemCount);
    setPage((prev) => prev + 1);

    finishLoading();
  };

  const canLoadMore = postsCount === null || posts.length < postsCount;

  const mutatePosts = useMemo(() => {
    return posts.map((p) => {
      return {
        ...p,
        community: communities[p.communityId],
        user: users[p.createdByUserId],
      };
    });
  }, [communities, posts, users]);

  const reportPost = (reason: string, postId: string) => {
    startReportPostLoading();

    return postApi
      .report(postId, reason)
      .then(() => {
        return postApi.getPostById(postId);
      })
      .then(({ post }) => {
        setPosts(posts.map((p) => (p.id === postId ? post : p)));
      })
      .catch(() => {
        notification.error({ message: `Error reporting post` });
      })
      .finally(finishReportPostLoading);
  };

  const reloadPosts = async () => {
    if (isLoading) return;

    startLoading();

    const { posts: newPosts, totalItemCount } = await postApi.fetchPostsFeed({
      page: 1,
      pageSize: PAGE_SIZE,
      includeOnlySaved,
    });
    setPosts([...newPosts]);
    setPostsCount(totalItemCount);
    setPage(2);

    finishLoading();
  };

  return {
    isLoading: isLoading || isUsersLoading || isCommunitiesLoading,
    posts: mutatePosts,
    canLoadMore,
    isReportPostLoading,
    loadMore: fetchPosts,
    reportPost,
    reloadPosts,
  };
};
