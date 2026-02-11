import { useBoolean } from 'ahooks';
import { notification } from 'antd';
import { useEffect, useState } from 'react';
import { eventsApi } from 'src/transport/events/events.api';

import { EventResponse } from 'src/transport/events/events.dto';

export const useEvents = () => {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [isLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    startLoading();

    eventsApi
      .getEventList({
        page: 1,
        size: 3,
        sortField: 'eventStart',
        sortOrder: 'asc',
      })
      .then((res) => {
        setEvents(res.data.events);
      })
      .catch(() => {
        notification.error({ message: 'Failed to load events' });
      })
      .finally(finishLoading);
  };

  return { events, isLoading };
};
