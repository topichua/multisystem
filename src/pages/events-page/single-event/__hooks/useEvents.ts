import { useBoolean } from 'ahooks';
import { notification } from 'antd';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EngagementAction } from 'src/hooks/useEngagementTracker/types.ts';
import { useEngagementTracker } from 'src/hooks/useEngagementTracker/useEngagementTracker.ts';

import { eventsApi } from 'src/transport/events/events.api';
import {
  EventAttachment,
  EventResponse,
  EventTicket,
} from 'src/transport/events/events.dto';

export const useEvent = () => {
  const { id } = useParams();
  const { track } = useEngagementTracker();

  const [isLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);

  const [event, setEvent] = useState<EventResponse | null>(null);
  const [tickets, setTickets] = useState<EventTicket[]>([]);
  const [attachments, setAttachments] = useState<EventAttachment[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    startLoading();

    Promise.all([
      eventsApi.getEvent(id as string),
      eventsApi.getEventTickets(id as string),
      eventsApi.getEventAttachment(id as string, 'docs'),
      eventsApi.getEventAttachment(id as string, 'links'),
    ])
      .then((res) => {
        const fetchedEvent = res[0].data;
        const fetchedTickets = res[1].data;
        const docs = res[2].data.attachments;
        const links = res[3].data.attachments;

        setEvent(fetchedEvent);
        setTickets(fetchedTickets);
        setAttachments([...docs, ...links]);

        if (fetchedEvent) {
          track({
            action: EngagementAction.ViewEvent,
            entityId: fetchedEvent.id,
            entityName: fetchedEvent.title || '',
            entityUrl: window.location.href,
          });
        }
      })
      .catch((e) => {
        notification.error({
          message: 'Error deleting post. Try again.',
          description: (e as AxiosError)?.message,
        });
      })
      .finally(finishLoading);
  };

  return { isLoading, event, tickets, attachments };
};
