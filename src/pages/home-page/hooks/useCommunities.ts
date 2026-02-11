import { useBoolean } from 'ahooks';
import { notification } from 'antd';
import { useEffect, useState } from 'react';

import { communityApi } from 'src/transport/communities/communities.api';
import {
  CommunitiesPreferenceItem,
  CommunitiyDto,
} from 'src/transport/communities/communities.dto';

export const useCommunities = () => {
  const [isLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);
  const [communities, setCommunities] = useState<CommunitiyDto[]>([]);

  const [communitiesPreference, setCommunitiesPreference] = useState<
    CommunitiesPreferenceItem[]
  >([]);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = () => {
    startLoading();

    communityApi
      .fetchRecommendedCommunities()
      .then(({ communities }) => setCommunities(communities))
      .catch(() => {
        notification.error({ message: 'Failed to load communities' });
      });

    communityApi
      .getPreference()
      .then(({ topJoined }) => setCommunitiesPreference(topJoined.slice(0, 3)))
      .catch(() => {
        notification.error({ message: 'Failed to load communities' });
      })
      .finally(finishLoading);
  };

  return { communities, isLoading, communitiesPreference };
};
