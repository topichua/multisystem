import {
  ClockCheck,
  Edit04,
  Expand03,
  Trash02,
} from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import { CollapseProps, Empty, notification, Tooltip } from 'antd';
import { AxiosError } from 'axios';
import { observer } from 'mobx-react';
import { useCallback, useMemo, useState } from 'react';
import { Button } from 'src/components/common/Button/Button';
import {
  CreatePostModal,
  CreatePostValues,
} from 'src/components/common/CreatePostModal/CreatePostModal';
import { Stack } from 'src/components/common/Stack/Stack';
import { useGetUsersByIds } from 'src/pages/community-pages/communities-home-feed/__hooks/useGetUsersByIds';
import { postApi } from 'src/transport/posts/posts.api';

import { Post, PostStatus, Report } from 'src/transport/posts/posts.dto';
import { getCalendarDateTime } from 'src/utils/date-time';
import { formatSingular } from 'src/utils/text';
import { CountLabels } from 'src/utils/text-consts';

import { CollapseLabel } from '../comments-reports-list/collapse-label';

import * as S from '../comments-reports-list/comments-reports-list.styled';
import { ReportsList } from '../comments-reports-list/reports-list';
import { PostModal } from '../post-modal/post-modal';
import { useCommunityManagementStore } from '../../admin-community.provider';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';

interface ErrorResponse {
  Message?: string;
}

const iconSizes = {
  width: 12,
  height: 12,
};

type PostsReportsListProps = {
  posts: Post[];
  onUpdateList: () => void;
  isReportedPostsLoading?: boolean;
};

export const PostsReportsList = observer(
  ({ posts, onUpdateList, isReportedPostsLoading }: PostsReportsListProps) => {
    const { permissions } = useCommunityManagementStore();
    const { globalPermission } = useCurrentUserStore();

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const [
      isOpenEditPostModal,
      { setTrue: openEditPostModal, setFalse: closeEditPostModal },
    ] = useBoolean(false);
    const [isEditing, { setTrue: startEdit, setFalse: finishEdit }] =
      useBoolean(false);
    const [
      isApprovingReport,
      { setTrue: startApproving, setFalse: finishApproving },
    ] = useBoolean(false);
    const [decliningReportId, setDecliningReportId] = useState<string | null>(
      null
    ); // report id or post id (if decline all)

    const usersIds = useMemo(() => {
      return posts.reduce((acc, current) => {
        acc.push(current.createdByUserId);

        acc = [
          ...acc,
          ...(current.reports ? current.reports.map((r) => r.userId) : []),
        ];

        return acc;
      }, [] as string[]);
    }, [posts]);

    const { users } = useGetUsersByIds(usersIds);

    const editPost = async (
      { id, ...data }: CreatePostValues,
      tags: string[]
    ) => {
      startEdit();
      try {
        await postApi.editPost({ ...data, id: id as string });
        await postApi.setTagsToPost(id as string, tags);

        onUpdateList();
        closeEditPostModal();

        if (selectedPost) {
          setSelectedPost({ ...selectedPost });
        }

        notification.success({
          message: 'Post edited successfully',
        });
        finishEdit();
      } catch (e) {
        const errorText = (e as AxiosError)?.response?.data as ErrorResponse;
        const message = errorText?.Message || errorText;

        notification.error({
          message: 'Error editing post. Try again.',
          description: message as string,
        });
      } finally {
        finishEdit();
      }
    };

    const approveReport = () => {
      startApproving();

      postApi
        .setStatus(
          selectedPost?.communityId as string,
          selectedPost?.id as string,
          PostStatus.ArchivedDueToReported
        )
        .then(() => {
          onUpdateList();
          setSelectedPost(null);
        })
        .catch((e) => {
          notification.error({
            message: 'Error approving report. Try again.',
            description: (e as AxiosError)?.message,
          });
        })
        .finally(finishApproving);
    };

    const declineReport = (reportId: string, communityId: string) => {
      setDecliningReportId(reportId);

      postApi
        .declineReports(communityId, [reportId])
        .then(() => {
          onUpdateList();
        })
        .catch((e) => {
          notification.error({
            message: 'Failed to decline the report. Please try again later.',
            description: (e as AxiosError)?.message,
          });
        })
        .finally(() => {
          setDecliningReportId(null);
        });
    };

    const declineAllReports = (post: Post) => {
      if (!post.reports) return;

      setDecliningReportId(post.id);

      postApi
        .declineReports(
          post.communityId,
          post.reports.map((r) => r.id)
        )
        .then(() => {
          onUpdateList();
          setSelectedPost(null);
        })
        .catch((e) => {
          notification.error({
            message: 'Failed to decline the reports. Please try again later.',
            description: (e as AxiosError)?.message,
          });
        })
        .finally(() => {
          setDecliningReportId(null);
        });
    };

    const renderAction = useCallback(
      (communityId: string) => (report: Report) => {
        if (permissions?.postDelete || globalPermission?.postDelete) {
          return (
            <Button
              danger
              size="small"
              icon={<Trash02 {...iconSizes} />}
              loading={decliningReportId === report.id}
              onClick={() => declineReport(report.id, communityId)}
            >
              Resolve
            </Button>
          );
        }

        return null;
      },
      [decliningReportId, declineReport, permissions, globalPermission]
    );

    const items: CollapseProps['items'] = useMemo(
      () =>
        posts.map((post) => ({
          key: post.id,
          label: (
            <CollapseLabel
              user={users[post.createdByUserId]}
              title={post.title}
              subtitle={[
                formatSingular(post?.reports?.length || 0, CountLabels.REPORTS),
                `Posted by ${users[post.createdByUserId]?.firstName} ${users[post.createdByUserId]?.lastName}`,
                getCalendarDateTime(post.createdAt),
              ].join(' \u2022 ')}
              actions={
                <Stack alignment="center">
                  {post.status !== PostStatus.Published && (
                    <Tooltip title="Archived post">
                      <Button
                        disabled
                        size="small"
                        icon={<ClockCheck {...iconSizes} />}
                      />
                    </Tooltip>
                  )}
                  <Button
                    type="default"
                    size="small"
                    icon={<Expand03 {...iconSizes} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPost(post);
                    }}
                  >
                    Show post
                  </Button>
                  {(permissions?.postDelete ||
                    globalPermission?.postDelete) && (
                    <Button
                      type="default"
                      size="small"
                      danger
                      icon={<Trash02 {...iconSizes} />}
                      loading={decliningReportId === post.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        declineAllReports(post);
                      }}
                    >
                      Resolve all in discussion
                    </Button>
                  )}
                </Stack>
              }
            />
          ),
          children: (
            <ReportsList
              reports={
                post.reports
                  ? post.reports.map((p) => ({ ...p, user: users[p.userId] }))
                  : []
              }
              renderActions={renderAction(post.communityId)}
            />
          ),
        })),
      [posts, users, decliningReportId]
    );

    if (!isReportedPostsLoading && posts.length === 0)
      return <Empty description="No reports yet" />;

    return (
      <>
        <S.Collapse items={items} />

        <PostModal
          post={selectedPost}
          footer={
            <Stack alignment="center">
              {(permissions?.postDelete || globalPermission?.postDelete) && (
                <>
                  <Button
                    type="default"
                    danger
                    size="large"
                    loading={decliningReportId === selectedPost?.id}
                    onClick={() => {
                      declineAllReports(selectedPost as Post);
                    }}
                  >
                    Deny
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    loading={isApprovingReport}
                    onClick={approveReport}
                  >
                    Approve
                  </Button>
                </>
              )}
              {(permissions?.postEdit || globalPermission?.postEdit) && (
                <Button
                  type="primary"
                  size="large"
                  icon={<Edit04 />}
                  onClick={openEditPostModal}
                >
                  Edit
                </Button>
              )}
              <Button onClick={() => setSelectedPost(null)} size="large">
                Close
              </Button>
            </Stack>
          }
          onClose={() => setSelectedPost(null)}
        />

        <CreatePostModal
          isOpen={isOpenEditPostModal}
          post={selectedPost || undefined}
          isLoading={isEditing}
          onClose={closeEditPostModal}
          onSave={editPost}
        />
      </>
    );
  }
);
