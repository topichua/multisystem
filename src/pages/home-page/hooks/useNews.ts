import { notification } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
import { NewsDeepDTO } from 'src/pages/news-and-resources/types/news.types';

import { newsApi } from 'src/transport/news/news.api';
import {
  GetItemsParams,
  NewsListResponse,
  UserCreatedDTO,
} from 'src/transport/news/news.dto';

const userCreatedRolePath = 'user_created.role.*';

interface UserCreatedDeepDTO extends Omit<UserCreatedDTO, 'role'> {
  role: {
    name: string;
    id: string;
  };
}

export interface NewsDeepRolesDTO
  extends Omit<NewsDeepDTO, 'userCreated' | 'categories'> {
  userCreated: UserCreatedDeepDTO;
  categories: {
    categoryId: {
      id: string;
      label: string;
    };
  }[];
}

const DEFAULT_PARAMS: GetItemsParams = {
  page: 1,
  sort: ['-date_created'],
  meta: '*',
  fields: `*.*, categories.category_id.*, ${userCreatedRolePath}`,
  limit: 4,
};

export const useNews = () => {
  const { getUserSegments } = useCurrentUserStore();
  const [isNewsLoading, setNewsLoading] = useState(false);
  const [news, setNews] = useState<NewsListResponse<NewsDeepRolesDTO>>();

  const getNews = useCallback(async () => {
    try {
      setNewsLoading(true);
      setNews(
        await newsApi.getNewsList<NewsDeepRolesDTO>({
          ...DEFAULT_PARAMS,
          filter: {
            _and: [
              {
                status: {
                  _eq: 'active',
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
        })
      );
    } catch {
      notification.error({ message: 'Failed to load news' });
    } finally {
      setNewsLoading(false);
    }
  }, [getUserSegments]);

  useEffect(() => {
    getNews();
  }, [getNews]);

  return { news, isNewsLoading };
};
