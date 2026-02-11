import {
  Circle,
  Eye,
  Hash01,
  MessageCircle01,
  ThumbsUp,
} from '@untitled-ui/icons-react';
import { Space, Tag, Tooltip, Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import dayjs from 'dayjs';
import noop from 'lodash/noop';
import { FC, ReactNode, useState } from 'react';

import { StackProps } from 'src/components/common/Stack/Stack';
import { components } from 'src/styled/definitions/colors';
import { NotificationPostDtoModel } from 'src/transport/notification/notification.dto';
import {
  PostLabelEnum,
  PostReportTypeEnum,
} from 'src/transport/posts/posts.dto';
import { postLabels, postReportSelectOptions } from 'src/utils/post/post-utils';

import * as S from './notifications-types.styled';

const { Text, Paragraph } = Typography;

const formatDate = (dateString: string | null | undefined): string => {
  const parsedDate = dayjs(dateString);
  return parsedDate.fromNow();
};

export const NotificationTitle: FC<TextProps> = (props = {}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Paragraph
      strong
      ellipsis={{
        rows: 2,
        expandable: 'collapsible',
        expanded,
        onExpand: (_, info) => setExpanded(info.expanded),
      }}
      {...props}
      style={{ marginBottom: 0 }}
    />
  );
};

export const PostLink: FC<{
  postId: string;
  postTitle: string;
  commentId?: string;
  communityId?: string;
}> = ({ postId, postTitle, commentId = undefined, communityId }) => {
  return (
    <S.Link
      to={`/communities/${communityId}/posts/${postId}${commentId ? `#comment-${commentId}` : ''} `}
    >
      {postTitle}
    </S.Link>
  );
};

export const CommunityLink: FC<{
  communityId?: string;
  communityName?: string;
}> = ({ communityId, communityName }) => {
  return (
    <S.Link to={`/communities/${communityId}/posts`}>{communityName}</S.Link>
  );
};

export const AdminCommunityLink: FC<{
  communityId?: string;
  communityName?: string;
}> = ({ communityId, communityName }) => {
  return (
    <S.Link to={`/admin/community/${communityId}/members`}>
      {communityName}
    </S.Link>
  );
};

export const NotificationDate: FC<{ date?: string | null }> = ({ date }) => {
  return <S.Date>{formatDate(date)}</S.Date>;
};

export const Username: FC<{ fn?: string; ln?: string }> = ({ fn, ln }) => {
  return <Text strong>{` ${fn || ''} ${ln || ''} `}</Text>;
};

export const ReportTypeTitle: FC<{
  reportType: PostReportTypeEnum | undefined;
}> = ({ reportType }) => {
  const _reportTypeTitle = postReportSelectOptions.find(
    ({ value }) => value === reportType
  );
  if (!_reportTypeTitle) return '';
  return <Text strong>{_reportTypeTitle?.label}</Text>;
};

export const Label: FC<{ postLabel?: PostLabelEnum; iconOnly?: boolean }> = ({
  postLabel,
  iconOnly = false,
}) => {
  if (!postLabel) return '';
  const _label = postLabels[postLabel] || null;
  if (!_label) return '';
  if (iconOnly)
    return (
      <Tooltip
        color="white"
        trigger={['click', 'hover']}
        title={
          <Space>
            <S.StyledLabel>{_label?.icon}</S.StyledLabel>
            <Text> {_label?.text}</Text>
          </Space>
        }
      >
        <S.StyledReportLabel
          color="purple"
          icon={<S.StyledLabel $isBlock={false}>{_label?.icon}</S.StyledLabel>}
        ></S.StyledReportLabel>
      </Tooltip>
    );
  return (
    <Space>
      <S.StyledLabel>{_label?.icon}</S.StyledLabel>
      {_label?.text}
    </Space>
  );
};

export const Tags: FC<{ tags?: NotificationPostDtoModel['tags'] }> = ({
  tags,
}) => {
  if (!tags?.length) return null;

  return (
    <Tooltip
      color="white"
      trigger={['click', 'hover']}
      title={
        <Space>
          {tags.map(({ id, name }) => {
            return (
              <Tag style={{ borderRadius: 10 }} key={id} color="purple">
                <Text>{name}</Text>
              </Tag>
            );
          })}
        </Space>
      }
    >
      <S.StyledReportLabel
        color="purple"
        icon={
          <S.StyledLabel $isBlock={false}>
            {<Hash01 width={14} height={14} />}
          </S.StyledLabel>
        }
      ></S.StyledReportLabel>
    </Tooltip>
  );
};

const totalIconProps: Pick<
  React.SVGAttributes<SVGSVGElement>,
  'width' | 'height'
> = {
  width: 14,
  height: 14,
};

type TotalContainerProps = {
  stackProps?: StackProps;
  totalViews?: number | null;
  totalComments?: number | null;
  totalLikes?: number | null;
};

export const TotalContainer: FC<TotalContainerProps> = ({
  stackProps,
  totalComments,
  totalLikes,
  totalViews,
}) => {
  return (
    <S.StyledTotalContainer
      spacing="none"
      alignment="baseline"
      {...(stackProps || {})}
    >
      <TotalViews count={totalViews} />
      <TotalComments count={totalComments} />
      <TotalLikes count={totalLikes} />
    </S.StyledTotalContainer>
  );
};

type TotalComponentProps = {
  count?: number | null;
};

export const TotalViews: FC<TotalComponentProps> = ({ count }) => {
  if (!count) return null;
  return (
    <S.StyledTotalTag icon={<Eye {...totalIconProps} />}>
      <Text>{count}</Text>
    </S.StyledTotalTag>
  );
};

export const TotalComments: FC<TotalComponentProps> = ({ count }) => {
  if (!count) return null;
  return (
    <S.StyledTotalTag icon={<MessageCircle01 {...totalIconProps} />}>
      <Text>{count}</Text>
    </S.StyledTotalTag>
  );
};

export const TotalLikes: FC<TotalComponentProps> = ({ count }) => {
  if (!count) return null;
  return (
    <S.StyledTotalTag icon={<ThumbsUp {...totalIconProps} />}>
      <Text>{count}</Text>
    </S.StyledTotalTag>
  );
};

export const AssetIcon: FC<{
  icon: ReactNode;
  fileName: string;
  communityId?: string;
}> = ({ icon, fileName, communityId }) => {
  return (
    <S.Link to={`/communities/${communityId}/resources`}>
      <S.StyledAsset spacing="extraTight">
        {icon}
        <Text>{fileName}</Text>
      </S.StyledAsset>
    </S.Link>
  );
};

interface MarkButtonProps {
  onClick?: () => void;
  notificationSeen?: boolean;
}

export const MarkButton: FC<MarkButtonProps> = ({
  onClick = noop,
  notificationSeen = true,
}) => {
  return (
    <Tooltip
      placement="bottom"
      title={!notificationSeen ? 'Mark as read' : undefined}
    >
      <S.MarkButton
        $notificationSeen={notificationSeen}
        type="text"
        size="small"
        disabled={notificationSeen}
        shape="circle"
        icon={
          <Circle
            color={!notificationSeen ? components.colors.brandColor : '#bfbfbf'}
            height={8}
            width={8}
          />
        }
        onClick={onClick}
      />
    </Tooltip>
  );
};
