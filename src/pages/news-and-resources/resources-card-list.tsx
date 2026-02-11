import { Empty, Row, Spin } from 'antd';
import compact from 'lodash/compact';
import { observer } from 'mobx-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { CardItemFlat } from 'src/components/common/Card/CardItemFlat';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { ResourceBookmark } from 'src/components/common/Resources/ResourceBookmark.tsx';
import { Stack } from 'src/components/common/Stack/Stack';
import {
  useResourceCategoryStore,
  useResourceTagStore,
} from 'src/pages/news-and-resources/store/resources.store.ts';
import { DIRECTUS_ASSETS_URL } from 'src/transport/directus.utils';
import { resourceApi } from 'src/transport/resources/resources.api';
import { CountLabels } from 'src/utils/text-consts.ts';
import { formatSingular } from 'src/utils/text.ts';

import { useCurrentUserStore } from '../authorized/authorization.layout';

import { pagesMap } from '../authorized/routes';
import * as C from './components';
import * as H from './hooks';
import * as S from './news-card-list.styled';
import * as U from './utils/utils';

export const ResourcesCardList = observer(() => {
  const navigate = useNavigate();
  const { getUserSegments } = useCurrentUserStore();
  const { selectedTags, tags, handleTagsChange } = useResourceTagStore();
  const { isOnlySaved, searchKeyword } = useResourceCategoryStore();

  const {
    resources,
    favoriteResourcesIds,
    setRequestParams,
    ref,
    resourcesResult,
    total,
  } = H.useResourcesList();

  const { handleSortChange } = H.useNewsSorting(
    setRequestParams,
    '*.*, tags.tagId.*.*'
  );

  const { categoryId, isDefaultCategory, innerHeaderTitle } = H.useCategories(
    resourceApi.getResourceCategoryById,
    `${pagesMap.resources}/${U.ALL_CATEGORIES_PARAM}`
  );

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
                  _in: selectedTags,
                },
              },
            },
          },
          {
            categories: {
              category_id: {
                id: {
                  _in: !categoryId || isDefaultCategory ? [] : [categoryId],
                },
              },
            },
          },
          {
            _or: [
              {
                segments: {
                  segment_id: {
                    id: {
                      _in: getUserSegments()?.map(({ id }) => `${id}`),
                    },
                  },
                },
              },
              {
                segments: {
                  _null: true,
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
    searchKeyword,
    selectedTags,
    setRequestParams,
  ]);

  const handleResourcesClick = useCallback(
    (id: string) => () => navigate(`${pagesMap.resources}/details/${id}`),
    [navigate]
  );

  const filteredResources = useMemo(
    () =>
      resources?.filter((item) =>
        isOnlySaved ? favoriteResourcesIds?.includes(item?.id) : true
      ),
    [favoriteResourcesIds, isOnlySaved, resources]
  );

  return (
    <S.StyledCardContainer>
      <Stack vertical spacing="none">
        <InnerPageHeader
          title={formatSingular(
            isOnlySaved ? filteredResources?.length : total || 0,
            CountLabels.RESOURCES
          )}
        >
          <Stack>
            <C.NewsSorter onSortChange={handleSortChange} />
            <C.FileTypeFilter setRequestParams={setRequestParams} />
          </Stack>
        </InnerPageHeader>
        <C.TagInlineSelector
          innerHeaderTitle={innerHeaderTitle}
          selectedTags={selectedTags}
          handleTagsChange={handleTagsChange}
          initTags={tags}
        />
      </Stack>
      <Spin spinning={resourcesResult.loading}>
        <S.StyledStack ref={ref} vertical align="center" gap={24} wrap={false}>
          <Page.Content
            style={{
              minHeight: 500,
              width: '100%',
              maxWidth: 1364,
            }}
          >
            <Row gutter={[16, 16]} wrap>
              {resources?.length
                ? filteredResources?.map((item, index) => (
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
                        onClick={handleResourcesClick(item.id)}
                        title={item?.name || ''}
                        additionalInformation={item.shortDescription}
                        tags={compact(
                          item?.tags?.map(({ tagId }) => tagId?.label)
                        )}
                        description={''}
                        // author={`${item?.userCreated?.firstName} ${item?.userCreated?.lastName}`}
                        bookmark={
                          <ResourceBookmark
                            initIsFavorite={
                              favoriteResourcesIds?.includes(item?.id) || false
                            }
                            resourceId={item?.id}
                          />
                        }
                      />
                    </S.StyledCol>
                  ))
                : !resourcesResult.loading && (
                    <Stack distribution="center" style={{ width: '100%' }}>
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No resources available"
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
