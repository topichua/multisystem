import { Typography, notification } from 'antd';
import { useState } from 'react';
import { useDebounce, useUpdateEffect } from 'ahooks';
import { AxiosError } from 'axios';

import { Stack } from 'src/components/common/Stack/Stack';
import { PostTag } from 'src/transport/communities/communities.dto';
import { PostTags as PostTagsSelector } from 'src/pages/community-pages/community-details/__components/post-tags/post-tags';
import { postApi } from 'src/transport/posts/posts.api';

const { Text } = Typography;

type PostTagsProps = {
  initialTags: Pick<PostTag, 'id' | 'name'>[];
  postId: string;
  canEdit?: boolean;
};

export const PostTags = ({
  initialTags,
  postId,
  canEdit = false,
}: PostTagsProps) => {
  const [tags, setTags] = useState(() => initialTags.map((t) => t.id));
  const debouncedTags = useDebounce(tags, { wait: 1000 });

  useUpdateEffect(() => {
    editTags();
  }, [debouncedTags]);

  const editTags = () => {
    postApi
      .setTagsToPost(postId, tags)
      .then(() => {
        notification.success({ message: 'Successfully updated' });
      })
      .catch((e) => {
        notification.error({
          message: 'Editing tags error. Try again.',
          description: (e as AxiosError)?.message,
        });
      });
  };

  return (
    <Stack vertical spacing="tight">
      <PostTagsSelector
        label={<Text type="secondary">TAGS</Text>}
        selectedTags={tags}
        reverseOrder
        readonly={!canEdit}
        onTagSelect={setTags}
      />
    </Stack>
  );
};
