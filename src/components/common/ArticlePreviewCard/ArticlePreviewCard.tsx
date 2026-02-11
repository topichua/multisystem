import * as React from 'react';
import { Avatar, CardProps, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { formatDate } from 'src/utils/date-time';
import * as S from './ArticlePreviewCard.styled';
import { Stack } from '../Stack/Stack';
import { Title } from '../Typography/Title';
import { Tag } from '../Tag/Tag';

const { Paragraph, Text } = Typography;

type ArticlePreviewCardProps = {
  id: string;
  name: string;
  description: string;
  date: Date;
  tags?: Array<string>;
  info?: Array<string>;
  user?: {
    avatarSrc: string | null;
    name: string;
    category: string;
  };
  thumbSrc?: string;
  thumbPosition?: 'start' | 'end';
  style?: React.CSSProperties;
} & CardProps;

export const ArticlePreviewCard = ({
  id,
  size,
  name,
  description,
  date,
  tags,
  info,
  user,
  thumbSrc,
  thumbPosition = 'end',
}: ArticlePreviewCardProps) => {
  return (
    <S.Card bordered={false} size={size}>
      {user && (
        <div className="user">
          <Stack alignment="center">
            <Avatar size={24} src={user.avatarSrc} />
            <div>
              <Text>{user.name}</Text>
              <Text type="secondary">&nbsp;in&nbsp;</Text>
              <Text>{user.category}</Text>
            </div>
            <Text type="secondary">&#183; {formatDate(date)}</Text>
          </Stack>
        </div>
      )}
      <div className={`content-row content-row--thumb-${thumbPosition}`}>
        <div className="content-main">
          <Link to={'/resources/' + id} className="link">
            <Title
              level={4}
              ellipsis={{
                rows: 2,
              }}
            >
              {name}
            </Title>
          </Link>
          <Paragraph
            className="description"
            ellipsis={{
              rows: 4,
            }}
          >
            {description}
          </Paragraph>
        </div>
        <div className="content-img">
          {thumbSrc ? (
            <img src={thumbSrc} width="120" height="120" alt="" />
          ) : null}
        </div>
      </div>
      <div className="info">
        {tags?.map((tag, i) => (
          <Tag bordered={false} key={`${id}-tag-${i}`}>
            {tag}
          </Tag>
        ))}
        <Stack wrap={false} split={<Text type="secondary">&#183;</Text>}>
          {info?.map((item) => <Text type="secondary">{item}</Text>)}
        </Stack>
      </div>
    </S.Card>
  );
};
