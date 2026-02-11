import { MessageAlertCircle } from '@untitled-ui/icons-react';
import { observer } from 'mobx-react';

import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { useCommunityManagementStore } from '../admin-community.provider';
import { useEffect } from 'react';
import { Skeleton } from 'antd';
import { CommentsReportsList } from '../__components/comments-reports-list/comments-reports-list';

export const AdminCommunityCommentsReport = observer(() => {
  const {
    isCommentsReportsLoading,
    commentsReports,
    communityId,
    loadCommentsReports,
    loadCommunityPostsStatistic,
  } = useCommunityManagementStore();

  useEffect(() => {
    loadCommentsReports();
  }, []);

  const handleUpdateList = () => {
    loadCommentsReports();
    loadCommunityPostsStatistic();
  };

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<MessageAlertCircle />}
          title="Reported comments"
        />
      </FixedContentHeader>
      <Page.Content>
        {isCommentsReportsLoading ? (
          <Skeleton active />
        ) : (
          <CommentsReportsList
            comments={commentsReports || []}
            communityId={communityId}
            updateList={handleUpdateList}
          />
        )}
      </Page.Content>
    </>
  );
});
