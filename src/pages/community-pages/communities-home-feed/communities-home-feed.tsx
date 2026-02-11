import { useRef, useState } from 'react';
import { HomeLine } from '@untitled-ui/icons-react';

import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { components } from 'src/styled/definitions/colors';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';

import { usePostsFeed } from './__hooks/usePostsFeed';

import { PostsList } from 'src/components/common/PostsList/PostsList';
import { Post } from 'src/transport/posts/posts.dto';

import * as S from './communities-home-feed.styled';
import { ReportModal } from '../community-post-details/__components/report-modal/report-modal';

export const CommunitiesHomeFeed = () => {
  const listInnerRef = useRef<HTMLDivElement>(null);

  const { posts, isLoading, isReportPostLoading, loadMore, reportPost } =
    usePostsFeed();

  const [selectedPostForReport, setSelectedPostForReport] =
    useState<null | Post>(null);

  const handleReportPost = (reason: string) => {
    reportPost(reason, selectedPostForReport?.id as string).then(() => {
      setSelectedPostForReport(null);
    });
  };

  const handleScroll = () => {
    const scrollTop = listInnerRef.current?.scrollTop || 0;
    const scrollHeight = listInnerRef.current?.scrollHeight || 0;
    const clientHeight = listInnerRef.current?.clientHeight || 0;

    if (scrollHeight - scrollTop === clientHeight) {
      loadMore();
    }
  };

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<HomeLine color={components.colors.brandColor} />}
          title="Home feed"
        />
      </FixedContentHeader>
      <S.StackContainer ref={listInnerRef} onScroll={handleScroll}>
        <PostsList
          posts={posts}
          isLoading={isLoading}
          onReportPost={setSelectedPostForReport}
        />
      </S.StackContainer>

      <ReportModal
        isOpen={!!selectedPostForReport}
        title="Would you like to report this post?"
        isLoading={isReportPostLoading}
        onReport={handleReportPost}
        onClose={() => setSelectedPostForReport(null)}
      />
    </>
  );
};
