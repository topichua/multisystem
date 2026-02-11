import { useState } from 'react';
import { useBoolean, useDebounce, useUpdateEffect } from 'ahooks';

import { useCommunityPostDetailsStore } from '../community-post-details.provider';

type UseToggleLikeProps = {
  initialValue: boolean;
  postOrCommentId: string;
  type: 'comment' | 'post' | 'save';
  initialLikesCount?: number;
};

export const useToggleLikeOrSave = ({
  initialValue,
  postOrCommentId,
  type,
  initialLikesCount,
}: UseToggleLikeProps) => {
  const {
    likePost,
    dislikePost,
    likeComment,
    dislikeComment,
    savePost,
    unSavePost,
  } = useCommunityPostDetailsStore();

  const [likesCount, setLikesCount] = useState(initialLikesCount || 0);
  const [value, { toggle: toggleValue }] = useBoolean(initialValue);
  const debouncedValue = useDebounce(value, { wait: 700 });

  useUpdateEffect(() => {
    if (type === 'post') {
      const request = debouncedValue ? likePost : dislikePost;
      request();
    } else if (type === 'comment') {
      const request = debouncedValue ? likeComment : dislikeComment;
      request(postOrCommentId);
    } else {
      const request = debouncedValue ? savePost : unSavePost;
      request();
    }
  }, [debouncedValue]);

  const toggle = () => {
    toggleValue();

    const increment = value ? -1 : 1;
    setLikesCount(likesCount + increment);
  };

  return { value, likesCount, toggleValue: toggle };
};
