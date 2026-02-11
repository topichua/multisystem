import { useEffect, useState } from 'react';
import { useBoolean } from 'ahooks';
import { uniq } from 'lodash';

import { eventsApi } from 'src/transport/events/events.api';
import { EventResponse, Ticket } from 'src/transport/events/events.dto';

type UseUpcomingEventsOptions = {
  size?: number;
  eventsType?: 'upcoming' | 'past';
};

export const useUserEvents = ({
  size = 4,
  eventsType = 'upcoming',
}: UseUpcomingEventsOptions) => {
  const [page, setPage] = useState(1);
  const [isLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);

  const [tickets, setTickets] = useState<null | Ticket[]>(null);
  const [totalTickets, setTotalTickets] = useState<number | null>(null);
  const [events, setEvents] = useState<Record<string, EventResponse>>({});
  const [favoriteEventsIds, setFavoriteEventsIds] = useState<string[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (isFetchMore: boolean = false) => {
    if (isLoading || (tickets?.length === totalTickets && isFetchMore)) return;

    startLoading();
    if (!isFetchMore) setTickets([]);

    const getEventsRequest =
      eventsType === 'upcoming'
        ? eventsApi.getUserUpcomingTickets
        : eventsApi.getUserPastTickets;

    const {
      data: { registeredTickets, totalItems },
    } = await getEventsRequest({
      size,
      page: !isFetchMore ? 1 : page,
    });

    const uniqEventsIds = uniq([
      ...registeredTickets.map((t) => t.eventId),
      ...Object.keys(events),
    ]);

    const fetchedEvents = await Promise.all(
      uniqEventsIds.map((id) => eventsApi.getEvent(id))
    ).then((res) => {
      return res.reduce(
        (acc, current) => {
          acc[current.data.id] = current.data;
          return acc;
        },
        {} as Record<string, EventResponse>
      );
    });

    if (!isFetchMore) {
      setPage(2);
    } else {
      setPage((prev) => prev + 1);
    }

    const favoriteEvents = await eventsApi.getFavoriteEvents();

    const favoriteEventsIds = favoriteEvents.data.events.map((x) => x.id);
    setFavoriteEventsIds(favoriteEventsIds);
    setTickets((prev) => prev && [...prev, ...registeredTickets]);
    setTotalTickets(totalItems);
    setEvents({ ...events, ...fetchedEvents });

    finishLoading();
  };

  const changeTicket = (
    changedTicketFields: Partial<Ticket>,
    ticketId: string
  ) => {
    setTickets(
      (tickets ?? []).map((ticket) => {
        if (ticket.ticketId !== ticketId) return ticket;
        return { ...ticket, ...changedTicketFields };
      })
    );
  };

  return {
    isLoading,
    events,
    favoriteEventsIds,
    tickets,
    totalTickets,
    fetchMore: () => fetchEvents(true),
    refetch: () => fetchEvents(false),
    changeTicket,
  };
};
