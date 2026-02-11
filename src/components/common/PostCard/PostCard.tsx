import { Skeleton, Typography } from 'antd';
import { ReactNode } from 'react';
import { Link, NavigateFunction } from 'react-router-dom';

import { Post } from 'src/transport/posts/posts.dto';
import { getCalendarDateTime } from 'src/utils/date-time';
import { formatSingular } from 'src/utils/text';
import { CountLabels } from 'src/utils/text-consts';

import { Divider } from '../Divider/Divider';

import { ExpandableHtml } from '../ExpandableHtml/expandableHtml';
import { Stack } from '../Stack/Stack';
import { Title } from '../Typography/Title';
import { UserAvatar } from '../user-avatar/User-avatar';
import * as S from './PostCard.styled';

const { Text } = Typography;

type PostCardProps = {
  post: Post;
  communityName?: string;
  actions?: ReactNode;
  report?: ReactNode;
  navigate: NavigateFunction;
};

export const PostCard = ({
  post,
  communityName,
  actions,
  report,
  navigate,
}: PostCardProps) => {
  const communityAlias = post?.community?.alias;

  return (
    <S.Card
      cover={
        post.imageUrl && (
          <img
            alt="cover"
            src={post.imageUrl}
            style={{ maxHeight: 300, width: '100%' }}
          />
        )
      }
    >
      {report}
      <Stack vertical spacing="loose">
        <Stack alignment="center" wrap={false}>
          <Stack.Item>
            <Stack alignment="center" spacing="normal">
              {!post?.user ? (
                <Skeleton.Avatar size={40} active />
              ) : (
                <UserAvatar
                  shape="circle"
                  firstName={post?.user?.firstName || ''}
                  lastName={post?.user?.lastName || ''}
                  src={post?.user?.avatarUrl}
                  size={40}
                />
              )}
            </Stack>
          </Stack.Item>

          <Stack.Item fill>
            <Stack alignment="center" spacing="extraTight">
              {!post?.user ? (
                <Skeleton.Button active style={{ width: 100, height: 20 }} />
              ) : (
                <Text className="username">
                  {post.user?.firstName} {post.user?.lastName}
                </Text>
              )}
              {post.user?.pronoun && (
                <Text className="secondary">({post.user?.pronoun})</Text>
              )}
              <Text className="secondary">
                {getCalendarDateTime(post.createdAt)}
              </Text>
            </Stack>
            <span className="secondary">
              Posted in{' '}
              {communityName ? (
                <Link to={`/communities/${communityAlias}`}>
                  {communityName || 'Unknown'}
                </Link>
              ) : (
                <Skeleton.Button active style={{ width: 50, height: 15 }} />
              )}
            </span>
          </Stack.Item>

          <Stack.Item>{actions}</Stack.Item>
        </Stack>

        <Stack vertical spacing="extraTight">
          <Stack.Item>
            <Title level={4} ellipsis={{ rows: 2 }} className="title">
              <Link to={`/communities/${communityAlias}/posts/${post.id}`}>
                {post.title}
              </Link>
            </Title>
          </Stack.Item>
          <Stack.Item>
            <S.ExpandableHtmlWrapper>
              <ExpandableHtml
                onExpandClick={() =>
                  navigate(`/communities/${communityAlias}/posts/${post.id}`)
                }
                rawHtml={post.body}
              />
            </S.ExpandableHtmlWrapper>
          </Stack.Item>

          <Divider spacing="tight" />

          <Stack alignment="center" distribution="equalSpacing">
            <Text type="secondary">
              {formatSingular(post.likesCount || 0, CountLabels.LIKES)}
            </Text>
            <Text type="secondary">
              {formatSingular(post.commentsCount || 0, CountLabels.COMMENTS)}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </S.Card>
  );
};
