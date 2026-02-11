import { Empty, Row, Spin } from 'antd';
import { observer } from 'mobx-react';
import { Page } from 'src/components/common/page/page.tsx';
import { useCallback, useMemo } from 'react';
import { pagesMap } from 'src/pages/authorized/routes.tsx';
import * as S from 'src/pages/news-and-resources/news-card-list.styled.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { CardItemFlat } from 'src/components/common/Card/CardItemFlat.tsx';
import { DIRECTUS_ASSETS_URL } from 'src/transport/directus.utils.ts';
import compact from 'lodash/compact';
import { ResourceBookmark } from 'src/components/common/Resources/ResourceBookmark.tsx';
import { useNavigate } from 'react-router-dom';
import * as H from 'src/pages/bookmark/tabs/resources/useResourcesList.ts';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
import { ResourceDeepDTO } from 'src/pages/news-and-resources/types/resources.types';

export const SavedResources = observer(() => {
  const navigate = useNavigate();
  const { getUserSegments } = useCurrentUserStore();
  const userSegments = getUserSegments();

  const { resources, ref, resourcesResult, toggleReload } =
    H.useResourcesList();

  const handleResourcesClick = useCallback(
    (id: string) => () => navigate(`${pagesMap.resources}/details/${id}`),
    [navigate]
  );

  const filteredResources: ResourceDeepDTO[] = useMemo(() => {
    if (resources?.length > 0 && userSegments && userSegments?.length > 0) {
      return resources
        .filter(
          (resource) =>
            !resource.segments ||
            resource.segments.length === 0 ||
            resource.segments.some((segment: any) =>
              userSegments.some(
                (userSegment) => segment.segmentId === userSegment.id
              )
            )
        )
        .filter((item) => item.status === 'active');
    }
    return [];
  }, [resources, userSegments]);

  return (
    <S.StyledCardContainer>
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
              {filteredResources?.length > 0
                ? filteredResources.map((item, index) => (
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
                            initIsFavorite={true}
                            resourceId={item?.id}
                            toggleReload={toggleReload}
                          />
                        }
                      ></CardItemFlat>
                    </S.StyledCol>
                  ))
                : !resourcesResult.loading && (
                    <Stack distribution="center" style={{ width: '100%' }}>
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No favorite resources"
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
