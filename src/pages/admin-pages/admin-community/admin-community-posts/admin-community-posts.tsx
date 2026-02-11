import { useEffect, useMemo, useState } from 'react';
import { DotsVertical, Eye, EyeOff, Rss02 } from '@untitled-ui/icons-react';
import { observer } from 'mobx-react';
import { Dropdown, Radio, Spin, notification } from 'antd';
import { useBoolean } from 'ahooks';

import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { Post, PostStatus } from 'src/transport/posts/posts.dto';
import { Stack } from 'src/components/common/Stack/Stack';
import { PostsList } from 'src/components/common/PostsList/PostsList';
import { useGetUsersByIds } from 'src/pages/community-pages/communities-home-feed/__hooks/useGetUsersByIds';
import { useGetCommunitiesByIds } from 'src/pages/community-pages/communities-home-feed/__hooks/useGetCommunitiesByIds';
import { Button } from 'src/components/common/Button/Button';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';
import { postApi } from 'src/transport/posts/posts.api';

import { useCommunityManagementStore } from '../admin-community.provider';

import { PostsTable } from '../__components/posts-table/posts-table';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';

const iconSizes = {
  width: 16,
  height: 16,
};

export const AdminCommunityPosts = observer(() => {
  const { isPostsLoading, communityPosts, permissions, loadPosts } =
    useCommunityManagementStore();
  const { globalPermission } = useCurrentUserStore();

  const [viewType, setViewType] = useState<'table' | 'feed'>('table');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PostStatus | null>(null);

  const [
    isToggleFrozenPostLoading,
    { setTrue: startToggleFroze, setFalse: finishToggleFroze },
  ] = useBoolean(false);
  const [selectedPostToAction, setSelectedPostToAction] = useState<Post | null>(
    null
  );

  const usersIds = useMemo(() => {
    if (!communityPosts) return [];

    return communityPosts.map((post) => post.createdByUserId);
  }, [communityPosts]);

  const { users, isLoading: isUsersLoading } = useGetUsersByIds(usersIds);

  const communitiesIds = useMemo(() => {
    if (!communityPosts) return [];

    return communityPosts?.map((post) => post.communityId);
  }, [communityPosts]);
  const { communities, isLoading: isCommunitiesLoading } =
    useGetCommunitiesByIds(communitiesIds);

  const postsWithUsers = useMemo(() => {
    return communityPosts?.map((post) => ({
      ...post,
      user: users[post.createdByUserId],
      community: communities[post.communityId],
    }));
  }, [communityPosts, users, communities]);

  const togglePostClose = () => {
    startToggleFroze();

    postApi
      .editPost({
        id: selectedPostToAction?.id as string,
        isFrozen: !selectedPostToAction?.isFrozen,
      })
      .then(() => {
        setSelectedPostToAction(null);
        loadPosts(status);
      })
      .catch(() => {
        notification.error({
          message: `Error ${!selectedPostToAction?.isFrozen ? 'closed' : 'open'} post. Try again.`,
        });
      })
      .finally(finishToggleFroze);
  };

  useEffect(() => {
    setPage(1);
    loadPosts(status);
  }, [status]);

  useEffect(() => {
    if (viewType === 'feed') setStatus(null);
  }, [viewType]);

  const renderActions = (post: Post) => {
    if (permissions?.postEdit || globalPermission?.postDelete) {
      return (
        <Stack distribution="center">
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  danger: !post.isFrozen,
                  icon: post.isFrozen ? (
                    <Eye {...iconSizes} />
                  ) : (
                    <EyeOff {...iconSizes} />
                  ),
                  label: post.isFrozen ? 'Open' : 'Close',
                  onClick: () => setSelectedPostToAction(post),
                },
              ],
            }}
          >
            <Button type="text" icon={<DotsVertical />} />
          </Dropdown>
        </Stack>
      );
    }

    return null;
  };

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader icon={<Rss02 />} title="All posts">
          <Stack distribution="trailing">
            <Radio.Group
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
            >
              <Radio.Button value="table">Table</Radio.Button>
              <Radio.Button value="feed">Feed</Radio.Button>
            </Radio.Group>
          </Stack>
        </InnerPageHeader>
      </FixedContentHeader>

      <Page.Content>
        <Stack vertical>
          {viewType === 'table' ? (
            <PostsTable
              posts={postsWithUsers || []}
              isLoading={isPostsLoading}
              currentPage={page}
              renderActions={renderActions}
              onChangeCurrentPage={setPage}
              onChangeStatus={setStatus}
            />
          ) : (
            <Spin
              spinning={
                isPostsLoading || isUsersLoading || isCommunitiesLoading
              }
            >
              <PostsList posts={postsWithUsers || []} isLoading={false} />
            </Spin>
          )}
        </Stack>
      </Page.Content>

      <ConfirmModal
        isOpen={!!selectedPostToAction}
        title={`Are you sure you want to ${selectedPostToAction?.isFrozen ? 'open' : 'close'} ${selectedPostToAction?.title}`}
        confirmButtonText={selectedPostToAction?.isFrozen ? 'Open' : 'Close'}
        confirmButtonProps={{ danger: !selectedPostToAction?.isFrozen }}
        isLoading={isToggleFrozenPostLoading}
        onClose={() => setSelectedPostToAction(null)}
        onConfirm={togglePostClose}
      />
    </>
  );
});
