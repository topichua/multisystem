import { useRef, useMemo } from 'react';
import { eventsApi } from 'src/transport/events/events.api.ts';
import { EventResponse } from 'src/transport/events/events.dto.ts';
import { useBoolean, useInfiniteScroll } from 'ahooks';

export interface IEvents {
  list: EventResponse[];
  total: number;
}

export const getLoadMoreList = async (): Promise<IEvents> => {
  const response = await eventsApi.getFavoriteEvents();

  return new Promise((resolve) =>
    resolve({
      list: response?.data.events,
      total: response?.data.totalItems,
    })
  );
};

export const useEventsList = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [reload, { toggle: toggleReload }] = useBoolean(true);

  const eventsResult = useInfiniteScroll<IEvents>(
    () => {
      return getLoadMoreList();
    },
    {
      target: ref,
      isNoMore: (resources) =>
        resources ? resources?.list.length === resources?.total : true,
      threshold: 200,
      reloadDeps: [reload],
    }
  );

  const events = useMemo(
    () => eventsResult?.data?.list as EventResponse[],
    [eventsResult?.data?.list]
  );

  return useMemo(
    () => ({ events, eventsResult, ref, toggleReload }),
    [events, eventsResult, toggleReload]
  );
};
