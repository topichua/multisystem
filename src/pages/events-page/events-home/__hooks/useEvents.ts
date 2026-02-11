import { useBoolean, useDebounce } from 'ahooks';
import { useEffect, useState } from 'react';

import { eventsApi } from 'src/transport/events/events.api';

import {
  EventResponse,
  GetEventsListDto,
} from 'src/transport/events/events.dto';

const PAGE_SIZE = 20;

export const useEvents = (initialFilter?: GetEventsListDto) => {
  const [page, setPage] = useState(1);
  const [isLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);
  const [events, setEvents] = useState<null | EventResponse[]>(null);
  const [totalEvents, setTotalEvents] = useState<null | number>(null);

  const [filter, setFilter] = useState<GetEventsListDto>(initialFilter || {});
  const [favoriteEventsIds, setFavoriteEventsIds] = useState<string[]>([]);

  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, { wait: 600 });

  useEffect(() => {
    fetchEvents();
  }, [debouncedKeyword, filter]);

  const fetchEvents = (isFetchMore: boolean = false) => {
    if (isLoading || (events?.length === totalEvents && isFetchMore)) return;

    startLoading();
    if (!isFetchMore) setEvents([]);

    eventsApi.getFavoriteEvents().then(({ data }) => {
      const favoriteEventsIds = data.events.map((x) => x.id);
      setFavoriteEventsIds(favoriteEventsIds);

      eventsApi
        .getEventList({
          page: !isFetchMore ? 1 : page,
          size: PAGE_SIZE,
          sortOrder: 'asc',
          isActiveEvent: null,
          ...(keyword !== '' && { keyword }),
          ...filter,
        })
        .then(({ data }) => {
          const { events: fetchedEvents, totalItems } = data;

          setTotalEvents(totalItems);

          if (!isFetchMore) {
            setEvents(fetchedEvents);
            setPage(2);
          } else {
            setEvents((prev) => prev && [...prev, ...fetchedEvents]);
            setPage((prev) => prev + 1);
          }
        })
        .finally(finishLoading);
    });
  };

  return {
    events,
    isLoading,
    keyword,
    favoriteEventsIds,
    filter,
    setFilter,
    setKeyword,
    fetchMore: () => fetchEvents(true),
  };
};
