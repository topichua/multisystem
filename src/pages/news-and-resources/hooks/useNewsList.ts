import { useState, useRef, useMemo, useEffect } from 'react';
import { newsApi } from 'src/transport/news/news.api.ts';
import { GetItemsParams, NewsDTO } from 'src/transport/news/news.dto.ts';
import { useInfiniteScroll } from 'ahooks';
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

export const getLoadMoreList = async (
  page: number,
  params?: GetItemsParams
): Promise<INews> => {
  const { data, meta } = await newsApi.getNewsList({
    ...params,
    page,
  });

  return {
    list: data,
    total: meta?.filterCount as number,
  };
};

export const useNewsList = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [requestParams, setRequestParams] =
    useState<GetItemsParams>(DEFAULT_PARAMS);
  const [favoriteNewsIds, setFavoriteNewsIds] = useState<string[]>([]);

  useEffect(() => {
    newsApi.getFavoriteNewsIds().then((response) => {
      setFavoriteNewsIds(response.favoriteNewsIds);
    });
  }, [requestParams]);

  const newsResult = useInfiniteScroll<INews>(
    (d) => {
      const page = d ? Math.ceil(d?.list.length / PAGE_SIZE) + 1 : 1;
      return getLoadMoreList(page, requestParams);
    },
    {
      target: ref,
      isNoMore: (news) => (news ? news?.list.length >= news?.total : true),
      threshold: 200,
      reloadDeps: [requestParams],
    }
  );

  const news = useMemo(
    () => newsResult?.data?.list as NewsDeepDTO[],
    [newsResult?.data?.list]
  );

  const total = useMemo(
    () => newsResult?.data?.total as number,
    [newsResult?.data?.total]
  );

  return useMemo(
    () => ({ news, favoriteNewsIds, setRequestParams, newsResult, ref, total }),
    [news, favoriteNewsIds, newsResult, total]
  );
};
