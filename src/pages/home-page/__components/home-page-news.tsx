import { Col } from 'antd';
import { slice } from 'lodash';
import { useMemo } from 'react';
import { MainNewsTextSkeleton } from 'src/components/common/ArticleCard/ArticleCard.styled.tsx';
import {
  ArticleCard,
  MainArticleCard,
} from 'src/components/common/ArticleCard/ArticleCard.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { Title } from 'src/components/common/Typography/Title.tsx';
import * as S from 'src/pages/home-page/home.page.styled.tsx';
import { useNews } from 'src/pages/home-page/hooks';
import { getDirectusAssetUrl } from 'src/transport/directus.utils.ts';

const HomePageNews = () => {
  const { news, isNewsLoading } = useNews();
  const restNews = useMemo(() => slice(news?.data, 1, 4), [news?.data]);

  return (
    <S.Section style={{ overflowX: 'hidden' }}>
      <S.SectionWrapper>
        <Stack vertical alignment="fill" spacing="extraLoose">
          <Title level={4} fontWeight={700}>
            Latest news
          </Title>
          <S.ArticleRow gutter={[60, 60]}>
            <Col xs={24}>
              <MainArticleCard
                isMain
                isLoading={isNewsLoading}
                news={news?.data?.[0]}
                categories={news?.data?.[0]?.categories?.map((category) => {
                  return {
                    id: `${category?.categoryId?.id}` || '',
                    name: category?.categoryId?.label || '',
                  };
                })}
              />
            </Col>

            {isNewsLoading &&
              [11, 22, 32].map((id) => {
                return (
                  <Col xs={24} md={12} lg={8} key={id}>
                    <MainNewsTextSkeleton
                      active
                      paragraph={{ rows: 4 }}
                      avatar={false}
                    />
                  </Col>
                );
              })}

            {!!restNews?.length &&
              restNews?.map((news) => {
                return (
                  <S.ArticleCol xs={24} sm={8} md={8} lg={8} key={news?.id}>
                    <ArticleCard
                      id={news?.id || ''}
                      date={new Date(news?.dateCreated || '')}
                      categories={news?.categories?.map((category) => {
                        return {
                          id: category.categoryId?.id || '',
                          name: category?.categoryId?.label || '',
                        };
                      })}
                      size="small"
                      name={news?.name || ''}
                      description={news?.content || ''}
                      user={{
                        avatarSrc:
                          getDirectusAssetUrl(
                            news?.userCreated?.avatar || undefined
                          ) || '',
                        name:
                          `${news?.userCreated?.firstName} ${news?.userCreated?.lastName}` ||
                          '',
                        role: news?.userCreated?.role?.name || '',
                        pronoun: news?.userCreated?.pronoun,
                      }}
                    />
                  </S.ArticleCol>
                );
              })}
          </S.ArticleRow>
        </Stack>
      </S.SectionWrapper>
    </S.Section>
  );
};

export default HomePageNews;
