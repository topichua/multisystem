import { useCallback, useEffect, useMemo, useState } from 'react';
import { DotsVertical, NotificationText } from '@untitled-ui/icons-react';
import { observer } from 'mobx-react';
import { Dropdown, Radio, Spin } from 'antd';

import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { Button } from 'src/components/common/Button/Button';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';
import { Post, PostStatus } from 'src/transport/posts/posts.dto';
import { PostsList } from 'src/components/common/PostsList/PostsList';
import { useGetUsersByIds } from 'src/pages/community-pages/communities-home-feed/__hooks/useGetUsersByIds';
import { useGetCommunitiesByIds } from 'src/pages/community-pages/communities-home-feed/__hooks/useGetCommunitiesByIds';

import { useCommunityManagementStore } from '../admin-community.provider';
import { PostsTable } from '../__components/posts-table/posts-table';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';

export const AdminCommunityApprovalPosts = observer(() => {
  const {
    isApprovalPostsLoading,
    communityApprovalPosts,
    isApprovalOrDeclinePostLoading,
    permissions,
    setPostStatus,
    loadApprovalPosts,
    loadCommunityPostsStatistic,
  } = useCommunityManagementStore();
  const { globalPermission } = useCurrentUserStore();

  const [viewType, setViewType] = useState<'table' | 'feed'>('table');
  const [page, setPage] = useState(1);

  const [selectedPostToApprove, setSelectedPostToApprove] =
    useState<Post | null>(null);
  const [selectedPostToDecline, setSelectedPostToDecline] =
    useState<Post | null>(null);

  const usersIds = useMemo(() => {
    if (!communityApprovalPosts) return [];

    return communityApprovalPosts.map((post) => post.createdByUserId);
  }, [communityApprovalPosts]);

  const { users, isLoading: isUsersLoading } = useGetUsersByIds(usersIds);

  const communitiesIds = useMemo(() => {
    if (!communityApprovalPosts) return [];

    return communityApprovalPosts?.map((post) => post.communityId);
  }, [communityApprovalPosts]);
  const { communities, isLoading: isCommunitiesLoading } =
    useGetCommunitiesByIds(communitiesIds);

  const postsWithUsers = useMemo(() => {
    return communityApprovalPosts?.map((post) => ({
      ...post,
      user: users[post.createdByUserId],
      community: communities[post.communityId],
    }));
  }, [communityApprovalPosts, users, communities]);

  useEffect(() => {
    loadApprovalPosts();
  }, []);

  const approvePost = () => {
    setPostStatus(
      selectedPostToApprove?.id as string,
      PostStatus.Published
    ).then(() => {
      loadApprovalPosts();
      loadCommunityPostsStatistic();
      setSelectedPostToApprove(null);
    });
  };

  const declinePost = () => {
    setPostStatus(
      selectedPostToDecline?.id as string,
      PostStatus.Acrhived
    ).then(() => {
      loadApprovalPosts();
      loadCommunityPostsStatistic();
      setSelectedPostToDecline(null);
    });
  };

  const renderActions = useCallback(
    (post: Post) => {
      if (permissions?.postApprove || globalPermission?.postApprove) {
        return (
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  label: 'Approve',
                  onClick: () => setSelectedPostToApprove(post),
                },
                {
                  key: '2',
                  danger: true,
                  label: 'Decline',
                  onClick: () => setSelectedPostToDecline(post),
                },
              ],
            }}
          >
            <Button type="text" icon={<DotsVertical />} />
          </Dropdown>
        );
      }

      return null;
    },
    [permissions, globalPermission]
  );

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<NotificationText />}
          title="Pending for approval"
        >
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
              isLoading={isApprovalPostsLoading}
              currentPage={page}
              renderActions={renderActions}
              onChangeCurrentPage={setPage}
            />
          ) : (
            <Spin
              spinning={
                isApprovalOrDeclinePostLoading ||
                isUsersLoading ||
                isCommunitiesLoading
              }
            >
              <PostsList posts={postsWithUsers || []} isLoading={false} />
            </Spin>
          )}
        </Stack>
      </Page.Content>

      <ConfirmModal
        isOpen={!!selectedPostToApprove}
        title={`Are you sure you want to approve '${selectedPostToApprove?.title}' post?`}
        confirmButtonText="Approve"
        isLoading={isApprovalOrDeclinePostLoading}
        onClose={() => setSelectedPostToApprove(null)}
        onConfirm={approvePost}
      />

      <ConfirmModal
        isOpen={!!selectedPostToDecline}
        confirmButtonProps={{ danger: true }}
        title={`Are you sure you want to decline '${selectedPostToDecline?.title}' post?`}
        isLoading={isApprovalOrDeclinePostLoading}
        confirmButtonText="Decline"
        onClose={() => setSelectedPostToDecline(null)}
        onConfirm={declinePost}
      />
    </>
  );
});
