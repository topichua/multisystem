import { useMemo } from 'react';
import { Dropdown, MenuProps, notification, Tooltip } from 'antd';
import {
  AlertTriangle,
  Bookmark,
  DotsHorizontal,
} from '@untitled-ui/icons-react';
import { useBoolean, useDebounce, useUpdateEffect } from 'ahooks';

import { Post } from 'src/transport/posts/posts.dto';
import { postApi } from 'src/transport/posts/posts.api';
import { components } from 'src/styled/definitions/colors';

import { Stack } from '../Stack/Stack';
import { Button } from '../Button/Button';

type PostActionsProps = {
  post: Post;
  onReport?: () => void;
  reloadPosts?: () => void;
};

export const PostActions = ({
  post,
  onReport,
  reloadPosts,
}: PostActionsProps) => {
  const [isPostSaved, { toggle: toggleSavePost }] = useBoolean(!!post.isSaved);
  const debouncedIsPostSaved = useDebounce(isPostSaved, { wait: 600 });
  const [isLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);

  useUpdateEffect(() => {
    const request = debouncedIsPostSaved
      ? postApi.savePost
      : postApi.unSavePost;

    const successMessage = debouncedIsPostSaved
      ? 'Successfully added to favourites'
      : 'Successfully removed from favourites';

    const errorMessage = debouncedIsPostSaved
      ? 'Error adding to favorites:'
      : 'Error removing from favorites:';

    request(post.id)
      .then(() => {
        notification.success({ message: successMessage });
        if (reloadPosts) {
          reloadPosts();
        }
      })
      .catch((error) => {
        notification.error({
          message: `${errorMessage}: ${error.message || error}`,
        });
      })
      .finally(finishLoading);
  }, [debouncedIsPostSaved]);

  const dropdownItems: MenuProps['items'] = useMemo(() => {
    return [
      {
        key: '1',
        label: 'Request action on post',
        disabled: !onReport,
        icon: <AlertTriangle height={14} width={14} />,
        onClick: onReport,
      },
    ];
  }, [onReport]);

  return (
    <Stack alignment="center" spacing="normal">
      <Tooltip title={isPostSaved ? 'Remove from saved' : 'Save'}>
        <Button
          type="link"
          loading={isLoading}
          icon={
            <Bookmark
              color={components.colors.primary}
              fill={isPostSaved ? components.colors.primary : 'none'}
            />
          }
          onClick={() => {
            toggleSavePost();
            startLoading();
          }}
        />
      </Tooltip>
      <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
        <Button type="link" icon={<DotsHorizontal />} />
      </Dropdown>
    </Stack>
  );
};
