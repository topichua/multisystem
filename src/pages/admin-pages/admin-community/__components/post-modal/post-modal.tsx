import { ReactNode } from 'react';
import { Skeleton, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { Post } from 'src/transport/posts/posts.dto';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { getCalendarDateTime } from 'src/utils/date-time';

import { usePost } from './usePost';
import * as S from '../post-comments-modal/post-comments-modal.styled';

const { Text } = Typography;

type PostModalProps = {
  post: Post | null;
  footer?: ReactNode;
  onClose: () => void;
};

export const PostModal = ({ post, footer, onClose }: PostModalProps) => {
  const { isLoading, post: fetchedPost, community } = usePost(post);

  return (
    <S.Modal
      width={1000}
      open={!!post}
      footer={footer}
      destroyOnClose
      title="Review reported post by user"
      onCancel={onClose}
    >
      {isLoading ? (
        <Skeleton active />
      ) : (
        <Stack vertical spacing="loose">
          <Stack.Item>
            <Stack vertical spacing="none">
              <Title level={3}>{fetchedPost?.title}</Title>
              <Stack alignment="center">
                <Text>{getCalendarDateTime(post?.createdAt || '')}</Text>
                <Text type="secondary">
                  Posted in{' '}
                  <Link to={`/communities/${community?.alias}`}>
                    {community?.name}
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Stack.Item>

          <Stack.Item>
            <div
              dangerouslySetInnerHTML={{ __html: fetchedPost?.body as string }}
            />
          </Stack.Item>
        </Stack>
      )}
    </S.Modal>
  );
};
