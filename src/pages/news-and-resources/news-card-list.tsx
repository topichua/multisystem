import { Empty, Row, Spin } from 'antd';
import compact from 'lodash/compact';
import { observer } from 'mobx-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { CardItemFlat } from 'src/components/common/Card/CardItemFlat';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { NewsBookmark } from 'src/components/common/News/NewsBookmark.tsx';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { useNewsStore } from 'src/pages/news-and-resources/store/news.store.ts';
import { DIRECTUS_ASSETS_URL } from 'src/transport/directus.utils';
import { CountLabels } from 'src/utils/text-consts.ts';
import { formatSingular } from 'src/utils/text.ts';

import { useCurrentUserStore } from '../authorized/authorization.layout';

import { pagesMap } from '../authorized/routes';
import { TagInlineSelector } from './components';
import * as C from './components';
import * as H from './hooks';
import * as S from './news-card-list.styled';

export const NewsCardList = observer(() => {
  const navigate = useNavigate();
  const { getUserSegments } = useCurrentUserStore();

  const {
    handleTagsChange,
    newsTags,
    selectedTags,
    isOnlySaved,
    searchKeyword,
  } = useNewsStore();

  const { news, favoriteNewsIds, setRequestParams, ref, newsResult, total } =
    H.useNewsList();
  const { categoryId, isDefaultCategory, innerHeaderTitle } = H.useCategories();

  useEffect(() => {
    setRequestParams((oldValue) => ({
      ...oldValue,
      filter: {
        _and: [
          {
            status: {
              _eq: 'active',
            },
            ...(searchKeyword && {
              name: {
                _icontains: searchKeyword,
              },
            }),
          },
          {
            tags: {
              tag_id: {
                id: {
                  _in: selectedTags?.map((s) => `${s}`),
                },
              },
            },
          },
          {
            categories: {
              category_id: {
                id: {
                  _in:
                    !categoryId || isDefaultCategory
                      ? []
                      : [categoryId]?.map((s) => `${s}`),
                },
              },
            },
          },
          {
            _or: [
              {
                segments: {
                  _null: true,
                },
              },
              {
                segments: {
                  segment_id: {
                    id: {
                      _in: getUserSegments()?.map(({ id }) => `${id}`),
                    },
                  },
                },
              },
            ],
          },
        ],
      },
    }));
  }, [
    categoryId,
    getUserSegments,
    isDefaultCategory,
    selectedTags,
    setRequestParams,
    searchKeyword,
  ]);

  const handleNewsClick = useCallback(
    (id: string) => () => navigate(`${pagesMap.news}/details/${id}`),
    [navigate]
  );

  const { handleSortChange } = H.useNewsSorting(setRequestParams);

  const filteredNews = useMemo(
    () =>
      news?.filter((item) =>
        isOnlySaved ? favoriteNewsIds?.includes(item?.id) : true
      ),
    [favoriteNewsIds, isOnlySaved, news]
  );

  return (
    <S.StyledCardContainer>
      <Stack vertical spacing="none">
        <InnerPageHeader
          title={formatSingular(
            isOnlySaved ? filteredNews?.length : total || 0,
            CountLabels.NEWS
          )}
        >
          <C.NewsSorter onSortChange={handleSortChange} />
        </InnerPageHeader>
        <TagInlineSelector
          isNews
          innerHeaderTitle={innerHeaderTitle}
          initTags={newsTags}
          handleTagsChange={handleTagsChange}
          selectedTags={selectedTags}
        />
      </Stack>
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
              {news?.length
                ? filteredNews?.map((item, index) => (
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
                            initIsFavorite={
                              favoriteNewsIds?.includes(item?.id) || false
                            }
                            newsId={item?.id}
                          />
                        }
                      ></CardItemFlat>
                    </S.StyledCol>
                  ))
                : !newsResult.loading && (
                    <Stack distribution="center" style={{ width: '100%' }}>
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No news available."
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
