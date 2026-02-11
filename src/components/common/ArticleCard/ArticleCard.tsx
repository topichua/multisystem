import { CardProps, Col, Row, Typography } from 'antd';

import { ClickScrollPlugin, OverlayScrollbars } from 'overlayscrollbars';
import { CSSProperties, FC, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { NewsDeepRolesDTO } from 'src/pages/home-page/hooks/useNews';
import { getDirectusAssetUrl } from 'src/transport/directus.utils';
import { formatDateNews } from 'src/utils/date-time';
import { Stack } from '../Stack/Stack';
import { Title } from '../Typography/Title';
import * as S from './ArticleCard.styled';
import { CategoryTag } from './components/CategoryTag';

OverlayScrollbars.plugin(ClickScrollPlugin);

const { Paragraph, Text } = Typography;

type ArticleCardProps = {
  id: string;
  size?: 'small' | 'medium';
  name: string;
  description: string;
  date: Date;
  categories?:
    | {
        name: string;
        id: string | number;
        onClick?: () => void;
      }[]
    | null;
  user?: {
    avatarSrc: string | null;
    name: string;
    role: string;
    category?: string;
    pronoun?: string;
  };
  style?: CSSProperties;
  isNews?: boolean;
  isMain?: boolean;
} & CardProps;

export const ArticleCard = ({
  id,
  size,
  name,
  description,
  date,
  categories = null,
  isMain = false,
  isNews = true,
  ...props
}: ArticleCardProps) => {
  const isSmall = size === 'small';

  return (
    <S.Card bordered={false} size={size} isMain={isMain} {...(props || {})}>
      <div className="info">
        <Text type="secondary">{formatDateNews(date)}</Text>
        <Stack spacing={'extraTight'} wrap={false}>
          {categories?.map(({ name, id, ...rest }) => (
            <CategoryTag onClick={rest?.onClick} key={id} name={name} />
          ))}
          <S.Gradient />
        </Stack>
      </div>
      <Link
        to={`${isNews ? '/news/details/' : '/resources/details/'}${id}`}
        className="link"
      >
        <Title
          level={isSmall ? 4 : 1}
          className="title"
          ellipsis={{
            rows: isSmall ? 2 : 3,
          }}
        >
          {name}
        </Title>
      </Link>
      <Paragraph
        className={`description ${isSmall ? 'description--small' : ''}`}
        ellipsis={{
          rows: 3,
        }}
      >
        {description}
      </Paragraph>
    </S.Card>
  );
};

type MainArticleCardProps = {
  cover?: string;
  news?: Partial<NewsDeepRolesDTO>;
  isLoading: boolean;
  isNews?: boolean;
  isMain?: boolean;
  categories?:
    | {
        name: string;
        id: string | number;
        onClick?: () => void;
      }[]
    | null;
};

export const MainArticleCard: FC<MainArticleCardProps> = ({
  news,
  isLoading,
  isNews = true,
  isMain = false,
  categories,
}) => {
  const coverUrl = useMemo(() => {
    return getDirectusAssetUrl(news?.image?.id);
  }, [news?.image?.id]);

  const skeleton = useMemo(() => {
    return (
      <Row gutter={[60, 24]}>
        <Col xs={24} md={10}>
          <S.MainNewsCoverSkeleton active />
        </Col>
        <Col xs={24} md={14}>
          <S.MainNewsTextSkeleton
            active
            paragraph={{ rows: 4 }}
            avatar={false}
          />
        </Col>
      </Row>
    );
  }, []);

  if (isLoading) return skeleton;

  return (
    <Row gutter={[60, 24]}>
      {coverUrl && (
        <Col xs={24} md={10}>
          <S.MainNewsCoverWrapper
            align={!isLoading ? 'center' : undefined}
            justify="center"
          >
            <S.StyledImage
              style={{ borderRadius: 8, objectFit: 'cover' }}
              src={coverUrl}
              preview={false}
              alt={news?.name || ''}
            />
          </S.MainNewsCoverWrapper>
        </Col>
      )}
      <Col xs={24} md={14}>
        <ArticleCard
          isMain={isMain}
          categories={categories}
          isNews={isNews}
          id={news?.id || ''}
          date={new Date(news?.dateCreated || '')}
          name={news?.name || ''}
          description={news?.content || ''}
          user={{
            avatarSrc:
              getDirectusAssetUrl(news?.userCreated?.avatar || undefined) || '',
            name:
              `${news?.userCreated?.firstName} ${news?.userCreated?.lastName}` ||
              '',
            role: news?.userCreated?.role?.name || '',
            pronoun: news?.userCreated?.pronoun,
          }}
        />
      </Col>
    </Row>
  );
};
