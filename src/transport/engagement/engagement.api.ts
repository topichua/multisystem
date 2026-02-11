import { EngagementTrackPayload } from 'src/hooks/useEngagementTracker/types.ts';
import axios from '../axios/axios-bond-instance';

export const engagementApi = {
  async trackEngagement(payload: EngagementTrackPayload) {
    return await axios.post('api/engagement/track', payload);
  },
};
