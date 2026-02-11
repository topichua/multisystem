import { useMemo } from 'react';
import {
  AlertTriangle,
  Bookmark,
  DotsHorizontal,
} from '@untitled-ui/icons-react';
import { Dropdown, MenuProps, Tooltip, Typography } from 'antd';

import { components } from 'src/styled/definitions/colors';

import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { InternalLink } from 'src/components/common/Link/Link';
import { Button } from 'src/components/common/Button/Button';
import { Card } from 'src/components/common/Card/Card';
import { Post } from 'src/transport/posts/posts.dto';
import { CommunitiyDto } from 'src/transport/communities/communities.dto';
import { getCalendarDate } from 'src/utils/date-time';
import { UserProfileDto } from 'src/transport/account/account.dto';

import { useToggleLikeOrSave } from '../../__hooks/useToggleLikeOrSave';
import { AttachmentsList } from '../attachments-list/attachments-list';
import { ReportTooltip } from '../report-tooltip/report-tooltip';

import * as S from './post-content.styled';

const { Text } = Typography;

const iconSize = {
  width: 16,
  height: 16,
};

type PostContentProps = {
  post: Post;
  community: CommunitiyDto;
  currentUser: UserProfileDto | null;
  isPostClosed: boolean;
  openReportModal: () => void;
};

export const PostContent = ({
  post,
  community,
  currentUser,
  openReportModal,
}: PostContentProps) => {
  const { value: isSaved, toggleValue: toggleSave } = useToggleLikeOrSave({
    initialValue: !!post.isSaved,
    postOrCommentId: post.id,
    type: 'save',
  });

  const currentUserReport = useMemo(() => {
    return post.reports?.find((r) => r.userId === currentUser?.id);
  }, [post, currentUser]);

  const dropdownItems: MenuProps['items'] = useMemo(() => {
    return [
      {
        key: '1',
        label: 'Request action on post',
        disabled:
          post.createdByUserId === currentUser?.id || !!currentUserReport,
        icon: <AlertTriangle {...iconSize} />,
        onClick: openReportModal,
      },
    ];
  }, [currentUserReport]);

  return (
    <Card
      cover={
        post.imageUrl && (
          <S.PostCover src={post.imageUrl} alt={`${post.title} cover`} />
        )
      }
    >
      {currentUserReport && <ReportTooltip report={currentUserReport} />}
      <Stack vertical spacing="extraLoose">
        <Stack vertical spacing="extraTight">
          <Stack
            alignment="center"
            distribution="equalSpacing"
            spacing="normal"
            wrap={false}
          >
            <Stack.Item fill>
              <Title level={3}>{post.title}</Title>
            </Stack.Item>

            <Stack alignment="center" wrap={false}>
              <Tooltip title={isSaved ? 'Remove from saved' : 'Save post'}>
                <Button
                  type="link"
                  icon={
                    <Bookmark
                      color={components.colors.primary}
                      fill={isSaved ? components.colors.primary : 'none'}
                    />
                  }
                  onClick={toggleSave}
                />
              </Tooltip>

              <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
                <Button type="link" icon={<DotsHorizontal />} />
              </Dropdown>
            </Stack>
          </Stack>

          <Stack spacing="extraTight" split="•">
            <Text type="secondary">{getCalendarDate(post.createdAt)}</Text>
            <Text type="secondary">
              Posted in{' '}
              <InternalLink href={`/communities/${community.alias}`}>
                {community.name}
              </InternalLink>
            </Text>
          </Stack>
        </Stack>

        <div dangerouslySetInnerHTML={{ __html: post.body }} />

        {post.attachments?.length && (
          <AttachmentsList attachments={post.attachments} />
        )}
      </Stack>
    </Card>
  );
};
