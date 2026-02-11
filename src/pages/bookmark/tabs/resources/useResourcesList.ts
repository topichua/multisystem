import { useBoolean, useInfiniteScroll } from 'ahooks';
import { useMemo, useRef, useState } from 'react';

import { GetItemsParams } from 'src/transport/news/news.dto';
import { resourceApi } from 'src/transport/resources/resources.api';
import { ResourceDTO } from 'src/transport/resources/resources.dto';
import { PAGE_SIZE } from 'src/pages/bookmark/tabs/news/useNewsList.ts';
import { ResourceDeepDTO } from 'src/pages/news-and-resources/types/resources.types.ts';

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

export const getLoadMoreList = async (page: number): Promise<IResources> => {
  const response = await resourceApi.getFavoriteResourceIds(page);

  let data: ResourceDTO[] = [];

  if (response.favoriteResourcesIds.length != 0) {
    const resourcesResponse = await resourceApi.getResourcesByIds(
      response.favoriteResourcesIds
    );
    data = resourcesResponse.data;
  }

  return new Promise((resolve) =>
    resolve({
      list: data,
      total: data?.length as number,
    })
  );
};

export const useResourcesList = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [requestParams, setRequestParams] =
    useState<GetItemsParams>(DEFAULT_PARAMS);
  const [reload, { toggle: toggleReload }] = useBoolean(true);

  const resourcesResult = useInfiniteScroll<IResources>(
    (d) => {
      const page = d ? Math.ceil(d?.list.length / PAGE_SIZE) + 1 : 1;
      return getLoadMoreList(page);
    },
    {
      target: ref,
      isNoMore: (resources) =>
        resources ? resources?.list.length === resources?.total : true,
      threshold: 200,
      reloadDeps: [requestParams, reload],
    }
  );

  const resources = useMemo(
    () => resourcesResult?.data?.list as ResourceDeepDTO[],
    [resourcesResult?.data?.list]
  );

  return useMemo(
    () => ({
      resources,
      setRequestParams,
      resourcesResult,
      ref,
      toggleReload,
    }),
    [resources, resourcesResult, toggleReload]
  );
};
