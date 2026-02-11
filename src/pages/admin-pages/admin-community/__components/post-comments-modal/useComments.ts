import { useBoolean } from 'ahooks';
import { useEffect, useMemo, useState } from 'react';
import { useGetUsersByIds } from 'src/pages/community-pages/communities-home-feed/__hooks/useGetUsersByIds';

import { postApi } from 'src/transport/posts/posts.api';
import { Comment } from 'src/transport/posts/posts.dto';

export const useComments = (postId: string | null) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);

  const usersIds = useMemo(() => {
    return comments.map((comment) => comment.createdByUserId);
  }, [comments]);

  const { users, isLoading: isUsersLoading } = useGetUsersByIds(usersIds);

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    startLoading();

    postApi
      .getCommentsByPostId(postId as string)
      .then(({ postComments }) => {
        setComments(postComments);
      })
      .finally(finishLoading);
  };

  const nestedComments = useMemo(() => {
    const commentMap: Record<string, Comment & { comments: Comment[] }> = {};

    comments.forEach((comment) => {
      commentMap[comment.id] = {
        ...comment,
        comments: [],
        user: users[comment.createdByUserId],
      };
    });

    const result: Comment[] = [];

    comments.forEach((comment) => {
      comment.user = users[comment.createdByUserId];
      if (comment.parentCommentId) {
        const parentComment = commentMap[comment.parentCommentId];
        if (parentComment) {
          parentComment.comments.push(commentMap[comment.id]);
        }
      } else {
        result.push(commentMap[comment.id]);
      }
    });

    return result;
  }, [comments, users]);

  return { comments: nestedComments, isLoading: isLoading || isUsersLoading };
};
