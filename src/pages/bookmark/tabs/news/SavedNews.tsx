import { Empty, Row, Spin } from 'antd';
import { observer } from 'mobx-react';
import { Page } from 'src/components/common/page/page.tsx';
import * as S from 'src/pages/news-and-resources/news-card-list.styled.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { CardItemFlat } from 'src/components/common/Card/CardItemFlat.tsx';
import { DIRECTUS_ASSETS_URL } from 'src/transport/directus.utils.ts';
import compact from 'lodash/compact';
import { NewsBookmark } from 'src/components/common/News/NewsBookmark.tsx';
import * as H from 'src/pages/bookmark/tabs/news/useNewsList.ts';
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { pagesMap } from 'src/pages/authorized/routes.tsx';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
import { NewsDeepDTO } from 'src/pages/news-and-resources/types/news.types';

export const SavedNews = observer(() => {
  const navigate = useNavigate();
  const { getUserSegments } = useCurrentUserStore();
  const userSegments = getUserSegments();
  const { news, ref, newsResult, toggleReload } = H.useNewsList();

  const handleNewsClick = useCallback(
    (id: string) => () => navigate(`${pagesMap.news}/details/${id}`),
    [navigate]
  );

  const filteredNews: NewsDeepDTO[] = useMemo(() => {
    if (news?.length > 0) {
      return news.filter(
        (item: any) =>
          !item.segments ||
          item.segments.length === 0 ||
          item.segments.some((segment: any) =>
            userSegments?.some(
              (userSegment: any) => segment.segmentId === userSegment.id
            )
          )
      );
    }
    return [];
  }, [news, userSegments]);

  return (
    <S.StyledCardContainer>
      <Spin spinning={newsResult.loading}>
        <S.StyledStack ref={ref} vertical align="center" gap={24} wrap={false}>
          <Page.Content
            style={{
              minHeight: 500,
              width: '100%',
              maxWidth: 1364,
            }}
          >
            <Row gutter={[16, 16]} wrap>
              {filteredNews?.length > 0
                ? filteredNews
                    ?.filter((item) => item.status === 'active')
                    .map((item, index) => (
                      <S.StyledCol
                        key={item.id}
                        $id={index}
                        xs={24}
                        sm={12}
                        md={8}
                        lg={12}
                        xl={8}
                        xxl={6}
                      >
                        <CardItemFlat
                          imageSrc={`${DIRECTUS_ASSETS_URL}${item?.image?.id}`}
                          imageAlt={'picture'}
                          onClick={handleNewsClick(item.id)}
                          title={item?.name || ''}
                          additionalInformation={item.shortDescription}
                          tags={compact(
                            item.tags?.map(({ tagId }) => tagId?.label)
                          )}
                          description={''}
                          bookmark={
                            <NewsBookmark
                              initIsFavorite={true}
                              newsId={item?.id}
                              toggleReload={toggleReload}
                            />
                          }
                        ></CardItemFlat>
                      </S.StyledCol>
                    ))
                : !newsResult.loading && (
                    <Stack distribution="center" style={{ width: '100%' }}>
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No favorite news."
                      />
                    </Stack>
                  )}
            </Row>
          </Page.Content>
        </S.StyledStack>
      </Spin>
    </S.StyledCardContainer>
  );
});
