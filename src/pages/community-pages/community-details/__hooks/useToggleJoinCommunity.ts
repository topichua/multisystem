import { useBoolean } from 'ahooks';
import { AxiosError } from 'axios';
import { EngagementAction } from 'src/hooks/useEngagementTracker/types.ts';
import { useEngagementTracker } from 'src/hooks/useEngagementTracker/useEngagementTracker.ts';

import { communityApi } from 'src/transport/communities/communities.api';

type Actions = {
  onSuccess?: (isJoined: boolean) => void;
  onError?: (e: AxiosError) => void;
};

export const useToggleJoinCommunity = (
  prevIsJoined: boolean,
  communityId?: string,
  communityName?: string,
  actions?: Actions
) => {
  const [
    isLoading,
    { setFalse: finishToggleJoinCommunity, setTrue: startToggleJoinCommunity },
  ] = useBoolean(false);
  const { track } = useEngagementTracker();

  const toggleJoinCommunity = () => {
    if (!communityId) return;

    const request = prevIsJoined
      ? communityApi.unJoinCommunity
      : communityApi.joinCommunity;

    startToggleJoinCommunity();
    request(communityId)
      .then(() => {
        if (actions?.onSuccess) actions.onSuccess(!prevIsJoined);
      })
      .then(() => {
        if (!prevIsJoined && communityName) {
          track({
            action: EngagementAction.JoinCommunity,
            entityId: communityId,
            entityName: communityName,
            entityUrl: window.location.href,
          });
        }
      })
      .catch((e) => {
        if (actions?.onError) actions.onError(e);
      })
      .finally(finishToggleJoinCommunity);
  };

  return { isLoading, toggleJoinCommunity };
};
