import { useInfiniteScroll } from 'ahooks';
import { useEffect, useMemo, useRef, useState } from 'react';

import { GetItemsParams } from 'src/transport/news/news.dto';
import { resourceApi } from 'src/transport/resources/resources.api';
import { ResourceDTO } from 'src/transport/resources/resources.dto';

import { ResourceDeepDTO } from '../types/resources.types';
import { PAGE_SIZE } from './useNewsList';
const a = `*.*, assets.*.*.*, tags.tag_id.*.*`;

const DEFAULT_PARAMS: GetItemsParams = {
  page: 1,
  sort: ['-date_created'],
  meta: '*',
  fields: a,
  limit: PAGE_SIZE,
};

export interface IResources {
  list: ResourceDTO[];
  total: number;
}

export const getLoadMoreList = async (
  page: number,
  params?: GetItemsParams
): Promise<IResources> => {
  const { data, meta } = await resourceApi.getResourceList({
    ...params,
    page,
  });

  return new Promise((resolve) =>
    resolve({
      list: data,
      total: meta?.filterCount as number,
    })
  );
};

export const useResourcesList = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [requestParams, setRequestParams] =
    useState<GetItemsParams>(DEFAULT_PARAMS);
  const [favoriteResourcesIds, setFavoriteResourcesIds] = useState<string[]>(
    []
  );

  useEffect(() => {
    resourceApi.getFavoriteResourceIds().then((response) => {
      setFavoriteResourcesIds(response.favoriteResourcesIds);
    });
  }, [requestParams]);

  const resourcesResult = useInfiniteScroll<IResources>(
    (d) => {
      const page = d ? Math.ceil(d?.list.length / PAGE_SIZE) + 1 : 1;
      return getLoadMoreList(page, requestParams);
    },
    {
      target: ref,
      isNoMore: (resources) =>
        resources ? resources?.list.length === resources?.total : true,
      threshold: 200,
      reloadDeps: [requestParams],
    }
  );

  const resources = useMemo(
    () => resourcesResult?.data?.list as ResourceDeepDTO[],
    [resourcesResult?.data?.list]
  );

  const total = useMemo(
    () => resourcesResult?.data?.total as number,
    [resourcesResult?.data?.total]
  );

  return useMemo(
    () => ({
      resources,
      favoriteResourcesIds,
      setRequestParams,
      resourcesResult,
      ref,
      total,
    }),
    [resources, favoriteResourcesIds, resourcesResult, total]
  );
};
