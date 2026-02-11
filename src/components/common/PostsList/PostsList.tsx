import { Empty, Skeleton, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

import { Post } from 'src/transport/posts/posts.dto';

import { Stack } from '../Stack/Stack';
import { PostCard } from '../PostCard/PostCard';
import { PostActions } from '../PostActions/PostActions';

import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
import { ReportTooltip } from 'src/pages/community-pages/community-post-details/__components/report-tooltip/report-tooltip';

import * as S from './PostsList.styled';

type PostsListProps = {
  posts: Post[];
  isLoading: boolean;
  onReportPost?: (post: Post) => void;
  reloadPosts?: () => void;
};

export const PostsList = ({
  posts,
  isLoading,
  onReportPost,
  reloadPosts,
}: PostsListProps) => {
  const navigate = useNavigate();
  const { user } = useCurrentUserStore();

  if (isLoading && posts.length === 0) return <Skeleton active />;

  if (posts.length === 0) {
    return <Empty description="No posts yet" style={{ paddingTop: 24 }} />;
  }

  return (
    <>
      <S.Wrapper>
        <Stack vertical spacing="extraLoose" wrap={false}>
          {posts.map((post) => {
            const report = post.reports?.find((r) => r.userId === user?.id);

            return (
              <PostCard
                key={post.id}
                post={post}
                report={report && <ReportTooltip report={report} />}
                communityName={post?.community?.name}
                actions={
                  <PostActions
                    reloadPosts={reloadPosts}
                    post={post}
                    onReport={
                      !report && onReportPost
                        ? () => onReportPost(post)
                        : undefined
                    }
                  />
                }
                navigate={navigate}
              />
            );
          })}
        </Stack>
        {isLoading && (
          <Stack distribution="center">
            <Spin style={{ padding: 24 }} />
          </Stack>
        )}
      </S.Wrapper>
    </>
  );
};
