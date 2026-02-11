import { useBoolean } from 'ahooks';
import { notification } from 'antd';
import { useEffect, useState } from 'react';

import { communityApi } from 'src/transport/communities/communities.api';
import { CommunitiyDto } from 'src/transport/communities/communities.dto';
import { postApi } from 'src/transport/posts/posts.api';
import { EditPostDto, Post } from 'src/transport/posts/posts.dto';

export const usePost = (initialPost: Post | null) => {
  const [isLoading, { setTrue: startLoad, setFalse: finishLoad }] =
    useBoolean(true);

  const [isEditing, { setTrue: startEdit, setFalse: finishEdit }] =
    useBoolean(false);

  const [post, setPost] = useState<Post | null>(null);
  const [community, setCommunity] = useState<CommunitiyDto | null>(null);

  useEffect(() => {
    if (initialPost) loadData();
  }, [initialPost]);

  const loadData = () => {
    startLoad();

    Promise.all([
      communityApi.getAdminCommunityPosts({
        communityId: initialPost?.communityId as string,
        postId: initialPost?.id as string,
      }),
      communityApi.getCommunityById(initialPost?.communityId as string),
    ])
      .then((res) => {
        const [fetchedPost] = res[0].posts;
        const fetchedCommunity = res[1].community.community;

        setPost(fetchedPost);
        setCommunity(fetchedCommunity);
      })
      .catch(() => {
        notification.error({
          message: 'Error fetching post. Try again.',
        });
      })
      .finally(finishLoad);
  };

  const editPost = (data: EditPostDto, tags: string[]) => {
    startEdit();

    return Promise.all([
      postApi.editPost(data),
      postApi.setTagsToPost(initialPost?.id as string, tags),
    ])
      .then(() => {
        loadData();
      })
      .finally(finishEdit);
  };

  return { isLoading, isEditing, post, community, editPost };
};
