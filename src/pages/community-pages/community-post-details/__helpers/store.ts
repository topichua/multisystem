import { Comment } from 'src/transport/posts/posts.dto';

import { CommentsData } from '../community-post-details.store';

export const deleteCommentAndChildren = (
  commentId: string,
  commentParentId: string | null,
  commentsData: CommentsData
): { updatedComments: CommentsData; deletedCount: number } => {
  let deletedCount = 0;

  const deleteRecursively = (id: string): void => {
    const childComments = commentsData[id] || [];

    deletedCount += 1;

    childComments.forEach((child) => {
      deleteRecursively(child.id);
    });

    delete commentsData[id];
  };

  deleteRecursively(commentId);

  if (commentParentId === null) {
    commentsData['all'] = commentsData['all'].filter(
      (comment) => comment.id !== commentId
    );
  } else {
    commentsData[commentParentId] = commentsData[commentParentId].filter(
      (comment) => comment.id !== commentId
    );
  }

  return { updatedComments: commentsData, deletedCount };
};

export const groupCommentsByParent = (
  comments: Comment[]
): Record<string, Comment[]> => {
  return comments.reduce((acc, comment) => {
    const key =
      comment.parentCommentId === null ? 'all' : comment.parentCommentId;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(comment);
    return acc;
  }, {} as CommentsData);
};

export const updateCommentBody = (
  commentId: string,
  newBody: string,
  commentsData: CommentsData
): CommentsData => {
  for (const key in commentsData) {
    const comments = commentsData[key];

    const index = comments.findIndex((comment) => comment.id === commentId);

    if (index !== -1) {
      comments[index] = {
        ...comments[index],
        body: newBody,
      };
      break;
    }
  }

  return { ...commentsData };
};
