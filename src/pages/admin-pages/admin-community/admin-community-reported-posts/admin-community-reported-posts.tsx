import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { MessageAlertSquare } from '@untitled-ui/icons-react';
import { Spin } from 'antd';

import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';

import { useCommunityManagementStore } from '../admin-community.provider';
import { PostsReportsList } from '../__components/posts-reports-list/posts-reports-list';

export const AdminCommunityReportedPosts = observer(() => {
  const {
    isReportedPostsLoading,
    reportedPosts,
    loadReportedPosts,
    loadCommunityPostsStatistic,
  } = useCommunityManagementStore();

  useEffect(() => {
    loadReportedPosts();
  }, []);

  const handleUpdateList = () => {
    loadReportedPosts();
    loadCommunityPostsStatistic();
  };

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader icon={<MessageAlertSquare />} title="Reported posts" />
      </FixedContentHeader>
      <Page.Content>
        <Spin spinning={isReportedPostsLoading}>
          <PostsReportsList
            posts={reportedPosts || []}
            onUpdateList={handleUpdateList}
            isReportedPostsLoading={isReportedPostsLoading}
          />
        </Spin>
      </Page.Content>
    </>
  );
});
