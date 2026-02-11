import { BookmarkCheck } from '@untitled-ui/icons-react';
import { useRef, useState } from 'react';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { PostsList } from 'src/components/common/PostsList/PostsList';

import { components } from 'src/styled/definitions/colors';
import { Post } from 'src/transport/posts/posts.dto';

import { usePostsFeed } from '../communities-home-feed/__hooks/usePostsFeed';
import { ReportModal } from '../community-post-details/__components/report-modal/report-modal';

import * as S from './saved-posts.styled';

type SavedPostsProps = {
  titleWithCount?: boolean;
};

export const SavedPosts = ({ titleWithCount = false }: SavedPostsProps) => {
  const listInnerRef = useRef<HTMLDivElement>(null);

  const {
    posts,
    isLoading,
    isReportPostLoading,
    loadMore,
    reportPost,
    reloadPosts,
  } = usePostsFeed(true);

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
        {titleWithCount ? (
          <InnerPageHeader
            title={
              !isLoading ? `${posts.length} bookmarked community posts` : ' '
            }
          />
        ) : (
          <InnerPageHeader
            icon={<BookmarkCheck color={components.colors.brandColor} />}
            title="Saved posts"
          />
        )}
      </FixedContentHeader>

      <S.StackContainer ref={listInnerRef} onScroll={handleScroll}>
        <PostsList
          posts={posts}
          isLoading={isLoading}
          onReportPost={setSelectedPostForReport}
          reloadPosts={() => reloadPosts()}
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
