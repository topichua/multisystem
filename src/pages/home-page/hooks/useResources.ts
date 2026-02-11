import { notification } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';

import { NewsDeepDTO } from 'src/pages/news-and-resources/types/news.types';
import { GetItemsParams, UserCreatedDTO } from 'src/transport/news/news.dto';
import { resourceApi } from 'src/transport/resources/resources.api';
import { ResourcesListResponse } from 'src/transport/resources/resources.dto';

const userCreatedRolePath = 'user_created.role.*';

interface UserCreatedDeepDTO extends Omit<UserCreatedDTO, 'role'> {
  role: {
    name: string;
    id: string;
  };
}

export interface ResourcesDeepRolesDTO
  extends Omit<NewsDeepDTO, 'userCreated' | 'categories'> {
  userCreated: UserCreatedDeepDTO;
  categories: {
    id: number;
    categoryId?: {
      id: number;
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

export const useResources = () => {
  const { getUserSegments } = useCurrentUserStore();
  const [isResourcesLoading, setResourcesLoading] = useState(false);
  const [resources, setResources] =
    useState<ResourcesListResponse<ResourcesDeepRolesDTO>>();

  const getResources = useCallback(async () => {
    try {
      setResourcesLoading(true);
      setResources(
        await resourceApi.getResourceList<ResourcesDeepRolesDTO>({
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
      notification.error({ message: 'Failed to load resources' });
    } finally {
      setResourcesLoading(false);
    }
  }, [getUserSegments]);

  useEffect(() => {
    getResources();
  }, [getResources]);

  return { resources, isResourcesLoading };
};
