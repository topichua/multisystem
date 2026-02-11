import { useBoolean } from 'ahooks';
import { difference, uniq } from 'lodash';
import { useEffect, useState } from 'react';
import { communityApi } from 'src/transport/communities/communities.api';

import { CommunitiyDto } from 'src/transport/communities/communities.dto';

export const useGetCommunitiesByIds = (communitiesIds: string[]) => {
  const [isLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);
  const [communities, setCommunities] = useState<Record<string, CommunitiyDto>>(
    {}
  );

  useEffect(() => {
    if (communitiesIds.length > 0) {
      fetchCommunities();
    }
  }, [communitiesIds]);

  const fetchCommunities = async () => {
    startLoading();

    const localCommunitiesIds = Object.keys(communities);
    const newCommunitiesIds = uniq(
      difference(communitiesIds, localCommunitiesIds)
    );

    const fetchedCommunities = (
      await communityApi.getCommunitiesList({
        page: 1,
        pageSize: newCommunitiesIds.length,
        communityIds: newCommunitiesIds,
      })
    ).communities;

    const newCommunities = fetchedCommunities.map((c) => c.community);

    const updatedCommunities = newCommunities.reduce(
      (acc, community) => {
        acc[community.id] = community;
        return acc;
      },
      { ...communities }
    );

    setCommunities(updatedCommunities);
    finishLoading();
  };

  return { communities, isLoading };
};
