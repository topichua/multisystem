import { useBoolean, useMount } from 'ahooks';
import { notification } from 'antd';
import { useCallback, useMemo, useState } from 'react';

import { communityApi } from 'src/transport/communities/communities.api';
import { DashboardMeetStatus } from 'src/transport/communities/communities.dto';

export const useDashboardMeetings = () => {
  const [dashBoardMeetings, setDashBoardMeetings] =
    useState<DashboardMeetStatus[]>();

  const [
    isDashboardMeetingsLoading,
    { setTrue: startLoading, setFalse: finishLoading },
  ] = useBoolean();

  useMount(async () => {
    try {
      startLoading();
      const { meets } = await communityApi.getDashboardMeetings({});
      setDashBoardMeetings(meets);
    } catch {
      notification.error({ message: 'Failed to load meetings. Try again.' });
    } finally {
      finishLoading();
    }
  });

  const updateMeetingStatus = useCallback(
    async (communityId: string, meetingId: string, newStatus: string) => {
      try {
        startLoading();
        await communityApi.updateMeetingStatus(
          communityId,
          meetingId,
          newStatus
        );
        const { meets } = await communityApi.getDashboardMeetings({});
        setDashBoardMeetings(meets);
      } catch {
        notification.error({
          message: 'Failed to update meeting status. Try again.',
        });
      } finally {
        finishLoading();
      }
    },
    [startLoading, finishLoading]
  );

  return useMemo(
    () => ({
      dashBoardMeetings,
      isDashboardMeetingsLoading,
      updateMeetingStatus,
    }),
    [isDashboardMeetingsLoading, dashBoardMeetings, updateMeetingStatus]
  );
};
