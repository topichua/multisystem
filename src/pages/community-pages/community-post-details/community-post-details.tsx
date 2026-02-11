import { ChevronLeft } from '@untitled-ui/icons-react';
import { Row, Col, Skeleton, notification } from 'antd';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { useBoolean } from 'ahooks';
import { AxiosError } from 'axios';

import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Stack } from 'src/components/common/Stack/Stack';
import { Page } from 'src/components/common/page/page';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { Button } from 'src/components/common/Button/Button';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';
import {
  CreatePostModal,
  CreatePostValues,
} from 'src/components/common/CreatePostModal/CreatePostModal';
import { PostStatus } from 'src/transport/posts/posts.dto';
import { isUserAdmin } from 'src/utils/post/user';
import { CommunityRole } from 'src/transport/communities/communities.dto';

import { PostContent } from './__components/post-content/post-content';
import { PostComments } from './__components/post-comments/post-comments';
import { PostTags } from './__components/post-tags/post-tags';
import { ReportModal } from './__components/report-modal/report-modal';
import { PostUser } from './__components/post-user/post-user';
import { useCommunityPostDetailsStore } from './community-post-details.provider';
import { CommunityPostDetailsHeader } from './__components/community-post-details-header/community-post-details-header';

import * as S from './community-post-details.styled';

export const CommunityPostDetails = observer(() => {
  const navigate = useNavigate();

  const {
    createdUser,
    commentsLoading,
    postLoading,
    communityLoading,
    community,
    userRole,
    post,
    comments,
    isDeletePostLoading,
    isEditPostLoading,
    isReportPostLoading,
    isRestorePostLoading,
    isOpenPostLoading,
    permissions,
    fetchPost,
    deletePost,
    editPost,
    reportPost,
    restorePost,
    openPost,
    createdUserPostCounter,
  } = useCommunityPostDetailsStore();
  const { user: currentUser } = useCurrentUserStore();

  const [
    isDeletePostModalOpen,
    { setTrue: openDeleteModal, setFalse: closeDeleteModal },
  ] = useBoolean(false);
  const [
    isEditPostModalOpen,
    { setTrue: openEditModal, setFalse: closeEditModal },
  ] = useBoolean(false);

  const [
    isReportModalOpen,
    { setTrue: openReportModal, setFalse: closeReportModal },
  ] = useBoolean(false);
  const [
    isPublishModalOpen,
    { setTrue: openPublishModal, setFalse: closePublishModal },
  ] = useBoolean(false);
  const [
    isUnfreezeModalOpen,
    { setTrue: openUnfreezeModal, setFalse: closeUnfreezeModal },
  ] = useBoolean(false);

  const handleDeletePost = () => {
    deletePost()
      .then(() => {
        navigate(`/communities/${community?.alias}/posts`);
      })
      .catch((e) => {
        notification.error({
          message: 'Error deleting post. Try again.',
          description: (e as AxiosError)?.message,
        });
      })
      .finally(closeDeleteModal);
  };

  const handleReportPost = (report: string) => {
    reportPost(report)
      .then(() => {
        fetchPost();
        notification.success({
          message: 'The report has been submitted successfully.',
        });
        closeReportModal();
      })
      .catch((e) => {
        notification.error({
          message: 'An error occurred. The report was not submitted.',
          description: (e as AxiosError)?.message,
        });
      });
  };

  const handleEditPost = async (
    { id, ...data }: CreatePostValues,
    tags: string[]
  ) => {
    editPost({ ...data, id: id as string }, tags)
      .then(closeEditModal)
      .catch((e) => {
        const errorText = e?.response?.data?.Message || e?.response?.data;
        notification.error({
          message: 'Error editing post. Try again.',
          description: errorText,
        });
      });
  };

  const handleRestorePost = () => {
    restorePost()
      .then(closePublishModal)
      .catch((e) => {
        notification.error({
          message: 'Error restoring post. Try again.',
          description: (e as AxiosError)?.message,
        });
      });
  };

  const handleUnfreezePost = () => {
    openPost()
      .then(closeUnfreezeModal)
      .catch((e) => {
        notification.error({
          message: 'Error opening post. Try again.',
          description: (e as AxiosError)?.message,
        });
      });
  };

  const isPostContentLoading =
    postLoading || post === null || communityLoading || community === null;
  const isCommentsLoading =
    (commentsLoading && comments === null) || (postLoading && post === null);

  const isPostDeleted = post?.status === PostStatus.Deleted;
  const isPostClosed = !!post?.isFrozen;
  const isCurrentUserAdmin =
    isUserAdmin(currentUser) || userRole === CommunityRole.CommunityMoModerator;
  const isCurrentUserOwner = currentUser?.id === post?.createdByUserId;

  const mainComments = comments?.['all'] || [];

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          title="Discussions"
          fillChildren
          icon={
            <Button
              type="link"
              icon={<ChevronLeft />}
              onClick={() => navigate(`/communities/${community?.alias}/posts`)}
            />
          }
        >
          <CommunityPostDetailsHeader
            post={post}
            isCurrentUserAdmin={isCurrentUserAdmin}
            isCurrentUserOwner={isCurrentUserOwner}
            permissions={permissions}
            openDeleteModal={openDeleteModal}
            openEditModal={openEditModal}
            openPublishModal={openPublishModal}
            openUnfreezeModal={openUnfreezeModal}
          />
        </InnerPageHeader>
      </FixedContentHeader>
      <Page.Content
        style={{
          maxWidth: 1200,
          width: '100%',
          minHeight: 500,
          margin: '0 auto',
        }}
      >
        <S.Wrapper disabled={isPostDeleted} closed={isPostClosed}>
          <Row gutter={[16, 16]}>
            <Col lg={16} sm={24}>
              <Stack vertical fill spacing="extraLoose" wrap={false}>
                {isPostContentLoading ? (
                  <Skeleton active />
                ) : (
                  <PostContent
                    post={post}
                    community={community}
                    currentUser={currentUser}
                    isPostClosed={isPostClosed}
                    openReportModal={openReportModal}
                  />
                )}

                {isCommentsLoading ? (
                  <Skeleton active />
                ) : (
                  <PostComments
                    comments={mainComments}
                    currentUser={currentUser || undefined}
                    userRole={userRole}
                    createdByUserId={post?.createdByUserId}
                    isPostClosed={isPostClosed}
                  />
                )}
              </Stack>
            </Col>
            <Col lg={8} sm={24}>
              <Stack vertical spacing="extraLoose">
                {isPostContentLoading ? (
                  <Skeleton active />
                ) : (
                  <Stack vertical>
                    {createdUser && (
                      <PostUser
                        user={createdUser}
                        createdUserPostCounter={createdUserPostCounter}
                      />
                    )}
                    <PostTags
                      initialTags={post?.tags || []}
                      postId={post.id}
                      canEdit={isCurrentUserOwner}
                    />
                  </Stack>
                )}
              </Stack>
            </Col>
          </Row>
        </S.Wrapper>
      </Page.Content>

      <ConfirmModal
        isOpen={isDeletePostModalOpen}
        isLoading={isDeletePostLoading}
        confirmButtonProps={{ danger: true }}
        confirmButtonText="Delete"
        title="Would you like to delete this post?"
        onConfirm={handleDeletePost}
        onClose={closeDeleteModal}
      />

      <ConfirmModal
        isOpen={isPublishModalOpen}
        isLoading={isRestorePostLoading}
        confirmButtonText="Restore"
        title="Would you like to restore this post?"
        onConfirm={handleRestorePost}
        onClose={closePublishModal}
      />

      <ConfirmModal
        isOpen={isUnfreezeModalOpen}
        isLoading={isOpenPostLoading}
        confirmButtonText="Open post"
        title="Would you like to open this post?"
        onConfirm={handleUnfreezePost}
        onClose={closeUnfreezeModal}
      />

      <CreatePostModal
        isOpen={isEditPostModalOpen}
        post={post || undefined}
        isLoading={isEditPostLoading}
        onClose={closeEditModal}
        onSave={handleEditPost}
      />

      <ReportModal
        title="Do you want to report this post?"
        isOpen={isReportModalOpen}
        isLoading={isReportPostLoading}
        onClose={closeReportModal}
        onReport={handleReportPost}
      />
    </>
  );
});
