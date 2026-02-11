import { useCallback } from 'react';
import { EngagementTrackPayload } from 'src/hooks/useEngagementTracker/types.ts';
import { engagementApi } from 'src/transport/engagement/engagement.api.ts';

export const useEngagementTracker = () => {
  const track = useCallback((payload: EngagementTrackPayload) => {
    engagementApi.trackEngagement(payload).catch((error) => {
      console.error('Failed to track engagement:', error);
    });
  }, []);

  return { track };
};
