import { useMemo, useState } from 'react';
import { CollapseProps, Empty, Typography } from 'antd';
import { Expand03 } from '@untitled-ui/icons-react';

import { Button } from 'src/components/common/Button/Button';
import { Comment } from 'src/transport/posts/posts.dto';
import { formatSingular } from 'src/utils/text';
import { getCalendarDateTime } from 'src/utils/date-time';
import { Stack } from 'src/components/common/Stack/Stack';
import { useGetUsersByIds } from 'src/pages/community-pages/communities-home-feed/__hooks/useGetUsersByIds';
import { postApi } from 'src/transport/posts/posts.api';
import { CountLabels } from 'src/utils/text-consts';

import { PostCommentsModal } from '../post-comments-modal/post-comments-modal';

import { CollapseLabel } from './collapse-label';
import { ReportsList } from './reports-list';

import * as S from './comments-reports-list.styled';
import { observer } from 'mobx-react';
import { useCommunityManagementStore } from '../../admin-community.provider';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';

enum ReportActionEnum {
  Approve = 'Approve',
  Decline = 'Decline',
}

type CommentsReportsListProps = {
  comments: Comment[];
  communityId: string;
  updateList: () => void;
};

const { Text } = Typography;

export const CommentsReportsList = observer(
  ({ comments, communityId, updateList }: CommentsReportsListProps) => {
    const { permissions } = useCommunityManagementStore();
    const { globalPermission } = useCurrentUserStore();

    const [selectedComment, setSelectedComment] = useState<Comment | null>(
      null
    );

    const [reportAction, setReportAction] = useState<ReportActionEnum | null>(
      null
    );

    const usersIds = useMemo(() => {
      return comments.reduce((acc, current) => {
        acc.push(current.createdByUserId);

        acc = [
          ...acc,
          ...(current.reports ? current.reports.map((r) => r.userId) : []),
        ];

        return acc;
      }, [] as string[]);
    }, [comments]);

    const { users } = useGetUsersByIds(usersIds);

    const declineReport = () => {
      if (!selectedComment) return;

      setReportAction(ReportActionEnum.Decline);

      postApi
        .declineReports(
          communityId,
          selectedComment?.reports?.map((r) => r.id)
        )
        .then(() => {
          updateList();
          setSelectedComment(null);
        })
        .finally(() => {
          setReportAction(null);
        });
    };

    const approveReport = () => {
      if (!selectedComment) return;

      setReportAction(ReportActionEnum.Approve);

      postApi
        .deleteComment(selectedComment.id, selectedComment.postId)
        .then(() => {
          updateList();
          setSelectedComment(null);
        })
        .finally(() => {
          setReportAction(null);
        });
    };

    if (comments.length === 0) return <Empty description="No reports yet" />;

    const items: CollapseProps['items'] = comments.map((comment) => ({
      key: comment.id,
      label: (
        <CollapseLabel
          title={<div dangerouslySetInnerHTML={{ __html: comment.body }} />}
          subtitle={[
            formatSingular(comment.reports.length, CountLabels.REPORTS),
            `Commented by ${users[comment.createdByUserId]?.firstName} ${users[comment.createdByUserId]?.lastName}`,
            getCalendarDateTime(comment.createdAt),
          ].join(' \u2022 ')}
          user={users[comment.createdByUserId]}
          actions={
            <Button
              type="default"
              size="small"
              icon={<Expand03 width={12} height={12} />}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedComment(comment);
              }}
            >
              View comment
            </Button>
          }
        />
      ),
      children: (
        <ReportsList
          reports={
            comment.reports
              ? comment.reports.map((r) => ({ ...r, user: users[r.userId] }))
              : []
          }
        />
      ),
    }));

    return (
      <>
        <S.Collapse items={items} />
        <PostCommentsModal
          reportedComment={selectedComment}
          footer={
            <Stack alignment="center" distribution="equalSpacing">
              <Text>Would you like to approve or deny comment removal?</Text>
              <Stack alignment="center" spacing={'tight'}>
                {(permissions?.commentDelete ||
                  globalPermission?.commentDelete) && (
                  <>
                    <Button
                      type="default"
                      danger
                      loading={reportAction === ReportActionEnum.Decline}
                      disabled={reportAction === ReportActionEnum.Approve}
                      size="large"
                      onClick={declineReport}
                    >
                      Deny
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      disabled={reportAction === ReportActionEnum.Decline}
                      loading={reportAction === ReportActionEnum.Approve}
                      onClick={approveReport}
                    >
                      Approve
                    </Button>
                  </>
                )}

                <Button
                  size="large"
                  disabled={!!reportAction}
                  onClick={() => setSelectedComment(null)}
                >
                  Close
                </Button>
              </Stack>
            </Stack>
          }
          onClose={() => setSelectedComment(null)}
        />
      </>
    );
  }
);
