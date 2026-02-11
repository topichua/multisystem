import { useEffect, useMemo, useState } from 'react';
import { ClockRewind, Expand03 } from '@untitled-ui/icons-react';
import { observer } from 'mobx-react';
import { Empty, Spin, Typography, notification } from 'antd';
import { useBoolean } from 'ahooks';
import { AxiosError } from 'axios';

import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { Button } from 'src/components/common/Button/Button';
import { getCalendarDateTime } from 'src/utils/date-time';
import { Post, PostStatus } from 'src/transport/posts/posts.dto';
import { postApi } from 'src/transport/posts/posts.api';
import { useGetUsersByIds } from 'src/pages/community-pages/communities-home-feed/__hooks/useGetUsersByIds';
import { Avatar, AvatarType } from 'src/components/common/Avatar/Avatar';

import { useCommunityManagementStore } from '../admin-community.provider';
import { PostModal } from '../__components/post-modal/post-modal';

import * as S from './admin-community-archived-posts.styled';

const iconSizes = {
  width: 12,
  height: 12,
};

const { Text } = Typography;

export const AdminCommunityArchivedPosts = observer(() => {
  const {
    archivedPosts,
    isArchivedPostsLoading,
    communityId,
    loadArchivedPosts,
    loadCommunityPostsStatistic,
  } = useCommunityManagementStore();

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPublishLoading, { setTrue: startPublish, setFalse: finishPublish }] =
    useBoolean(false);

  const usersIds = useMemo(() => {
    if (!archivedPosts) return [];

    return archivedPosts?.map((post) => post.createdByUserId);
  }, [archivedPosts]);
  const { users } = useGetUsersByIds(usersIds);

  useEffect(() => {
    loadArchivedPosts();
  }, []);

  const publishPost = () => {
    startPublish();

    postApi
      .setStatus(communityId, selectedPost?.id as string, PostStatus.Published)
      .then(() => {
        loadArchivedPosts();
        setSelectedPost(null);
        loadCommunityPostsStatistic();
      })
      .catch((e) => {
        notification.error({
          message: 'Unable to publish the post. Please try again later.',
          description: (e as AxiosError)?.message,
        });
      })
      .finally(finishPublish);
  };

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader icon={<ClockRewind />} title="Archived posts" />
      </FixedContentHeader>

      <Page.Content>
        <Spin spinning={isArchivedPostsLoading}>
          <Stack vertical>
            {archivedPosts?.map((post) => (
              <S.Wrapper key={post.id}>
                <Stack alignment="center" wrap={false}>
                  <Avatar
                    size={40}
                    avatarSrc={post.imageUrl}
                    type={AvatarType.collaboration}
                    shape="square"
                  />

                  <Stack.Item fill>
                    <Stack vertical spacing="none">
                      <Title level={5}>{post.title}</Title>

                      <Text>
                        {[
                          `Posted by ${users[post.createdByUserId]?.firstName || ''} ${users[post.createdByUserId]?.lastName || ''}`,
                          getCalendarDateTime(post.createdAt),
                        ].join(' • ')}
                      </Text>
                    </Stack>
                  </Stack.Item>

                  <Button
                    size="small"
                    icon={<Expand03 {...iconSizes} />}
                    onClick={() => setSelectedPost(post)}
                  >
                    View post
                  </Button>
                </Stack>
              </S.Wrapper>
            ))}
          </Stack>

          {!isArchivedPostsLoading && archivedPosts?.length === 0 && (
            <Empty description="No posts" />
          )}
        </Spin>
      </Page.Content>

      <PostModal
        post={selectedPost}
        footer={
          <Stack alignment="center">
            <Button
              type="primary"
              size="large"
              loading={isPublishLoading}
              onClick={publishPost}
            >
              Publish
            </Button>
            <Button onClick={() => setSelectedPost(null)} size="large">
              Close
            </Button>
          </Stack>
        }
        onClose={() => setSelectedPost(null)}
      />
    </>
  );
});
