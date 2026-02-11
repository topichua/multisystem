import { useState, useRef, useMemo } from 'react';
import { newsApi } from 'src/transport/news/news.api.ts';
import { GetItemsParams, NewsDTO } from 'src/transport/news/news.dto.ts';
import { useBoolean, useInfiniteScroll } from 'ahooks';
import { NewsDeepDTO } from 'src/pages/news-and-resources/types/news.types.ts';

export const PAGE_SIZE = 8;

const DEFAULT_PARAMS: GetItemsParams = {
  page: 1,
  sort: ['-date_created'],
  meta: '*',
  fields: '*.*, tags.*.*',
  limit: PAGE_SIZE,
};

export interface INews {
  list: NewsDTO[];
  total: number;
}

export const getLoadMoreList = async (page: number): Promise<INews> => {
  const response = await newsApi.getFavoriteNewsIds(page);

  let data: NewsDTO[] = [];

  if (response.favoriteNewsIds.length != 0) {
    const newsResponse = await newsApi.getNewsByIds(response.favoriteNewsIds);
    data = newsResponse.data;
  }

  return new Promise((resolve) =>
    resolve({
      list: data,
      total: data?.length as number,
    })
  );
};

export const useNewsList = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [requestParams, setRequestParams] =
    useState<GetItemsParams>(DEFAULT_PARAMS);

  const [reload, { toggle: toggleReload }] = useBoolean(true);

  const newsResult = useInfiniteScroll<INews>(
    (d) => {
      const page = d ? Math.ceil(d?.list.length / PAGE_SIZE) + 1 : 1;
      return getLoadMoreList(page);
    },
    {
      target: ref,
      isNoMore: (news) => (news ? news?.list.length >= news?.total : true),
      threshold: 200,
      reloadDeps: [requestParams, reload],
    }
  );

  const news = useMemo(
    () => newsResult?.data?.list as NewsDeepDTO[],
    [newsResult?.data?.list]
  );

  return useMemo(
    () => ({ news, setRequestParams, newsResult, ref, toggleReload }),
    [news, newsResult, toggleReload]
  );
};
