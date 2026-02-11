import {
  AnnotationX,
  Edit05,
  Eye,
  MessageSquare01,
  Rows01,
  ThumbsUp,
} from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import { Button, List, notification, Typography } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useMemo } from 'react';
import {
  CreatePostModal,
  CreatePostValues,
} from 'src/components/common/CreatePostModal/CreatePostModal';
import { Page } from 'src/components/common/page/page';

import { Stack } from 'src/components/common/Stack/Stack';
import { Tag } from 'src/components/common/Tag/Tag';
import { postApi } from 'src/transport/posts/posts.api';
import { PostStatus } from 'src/transport/posts/posts.dto';
import { getCalendarDateTime } from 'src/utils/date-time';
import { useGetUsersByIds } from '../../communities-home-feed/__hooks/useGetUsersByIds';
import { PostItem } from '../__components/post-item/post-item';

import { useCommunityDetailsStore } from '../community-details.provider';

import * as S from './community-details-posts.styled';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';

const { Text } = Typography;

const iconSize = {
  width: 14,
  height: 14,
};

export const CommunityDetailsPosts = observer(() => {
  const {
    posts,
    postsLoading,
    createPostLoading,
    communityId,
    permissions,
    fetchPosts,
    createPost,
    communityAlias,
  } = useCommunityDetailsStore();
  const { globalPermission } = useCurrentUserStore();

  const usersIds = useMemo(() => {
    return posts ? posts?.map((post) => post.createdByUserId) : [];
  }, [posts]);

  const { users, isLoading: isUsersLoading } = useGetUsersByIds(usersIds);

  const postsWithUsers = useMemo(() => {
    return posts?.map((post) => ({
      ...post,
      user: users[post.createdByUserId],
    }));
  }, [posts, users]);

  const [
    isOpenCreatePostModal,
    { setTrue: openCreatePostModal, setFalse: closeCreatePostModal },
  ] = useBoolean(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (
    newPost: CreatePostValues,
    tags: string[]
  ) => {
    createPost({ ...newPost, communityId })
      .then((post) => {
        closeCreatePostModal();

        const successMessage =
          post.status === PostStatus.WaitForApproval
            ? 'Successfully created. Waiting for approval'
            : 'Successfully created';

        notification.success({
          message: successMessage,
        });

        if (tags.length > 0) {
          postApi.setTagsToPost(post.id, tags);
        }
      })
      .catch((e) => {
        const errorText = e?.response?.data?.Message || e?.response?.data;
        notification.error({
          message: 'Error creating post. Try again.',
          description: errorText,
        });
      });
  };

  return (
    <Stack vertical>
      <Page.Content
        style={{ maxWidth: 1064, minHeight: 500, margin: '0 auto' }}
      >
        <Stack vertical spacing="normal">
          {(permissions?.postCreate || globalPermission?.postCreate) && (
            <Stack.Item>
              <Stack>
                <Button
                  type="primary"
                  icon={<Edit05 width={16} height={16} />}
                  onClick={openCreatePostModal}
                >
                  Create post
                </Button>
              </Stack>
            </Stack.Item>
          )}

          <Stack.Item>
            <Stack alignment="center" spacing="tight">
              <Text type="secondary">
                <Rows01 width={16} height={16} display={'block'} />
              </Text>
              <Text strong>Community posts</Text>
            </Stack>
          </Stack.Item>

          <Stack.Item>
            <List
              bordered
              size="small"
              loading={postsLoading || isUsersLoading}
              dataSource={postsWithUsers || []}
              renderItem={(post) => (
                <List.Item>
                  <PostItem
                    title={
                      <Stack alignment="center">
                        <S.PostTitle
                          to={`/communities/${communityAlias}/posts/${post.id}`}
                        >
                          {post.title}
                        </S.PostTitle>

                        {post.isFrozen && (
                          <Tag
                            color={'warning'}
                            size="small"
                            icon={<AnnotationX {...iconSize} />}
                          >
                            Closed post
                          </Tag>
                        )}
                      </Stack>
                    }
                    avatarSrc={post?.imageUrl || undefined}
                    subtitle={
                      <Stack vertical spacing="normal">
                        <Stack vertical spacing="none">
                          <Stack.Item fill ellipsis>
                            <Text style={{ fontSize: 12 }}>
                              {`Created by ${post?.user?.firstName || ''} ${post?.user?.lastName || ''} \u2022 `}
                              {getCalendarDateTime(post.createdAt)}
                            </Text>
                          </Stack.Item>
                        </Stack>
                      </Stack>
                    }
                  >
                    <Stack alignment="center" spacing="extraTight">
                      <S.StyledStatButton
                        disabled
                        size="small"
                        type="text"
                        icon={<Eye {...iconSize} />}
                      >
                        {` ${post?.viewsCount || 0}`}
                      </S.StyledStatButton>
                      <S.StyledStatButton
                        disabled
                        size="small"
                        type="text"
                        icon={<ThumbsUp {...iconSize} />}
                      >
                        {` ${post?.likesCount || 0}`}
                      </S.StyledStatButton>
                      <S.StyledStatButton
                        size="small"
                        type="text"
                        icon={<MessageSquare01 {...iconSize} />}
                        disabled
                      >
                        {` ${post.commentsCount || 0} `}
                      </S.StyledStatButton>
                    </Stack>
                  </PostItem>
                </List.Item>
              )}
            />
          </Stack.Item>
        </Stack>
      </Page.Content>

      <CreatePostModal
        isOpen={isOpenCreatePostModal}
        isLoading={createPostLoading}
        onSave={handleCreatePost}
        onClose={closeCreatePostModal}
      />
    </Stack>
  );
});
