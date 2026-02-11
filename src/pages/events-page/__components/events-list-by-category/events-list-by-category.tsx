import { useBoolean } from 'ahooks';
import { useRef, useState } from 'react';
import { Empty, Spin } from 'antd';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal.tsx';

import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { SearchBar } from 'src/components/common/Searchbar/Searchbar';
import { eventsApi } from 'src/transport/events/events.api.ts';
import { EventListing, EventResponse } from 'src/transport/events/events.dto';

import { EventsFilter } from '../../events-home/__components/event-filter/event-filter';
import { EventComponent } from '../../events-home/__components/event-components/event-component';
import { useEvents } from '../../events-home/__hooks/useEvents';

import * as S from './events-list-by-category.styled';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
import { Button } from 'src/components/common/Button/Button';
import { useEventAction } from '../../events-home/__hooks/useEventAction';
import { EventBookmark } from 'src/components/common/Events/EventsBookmark.tsx';

type EventsListByCategoryProps = {
  listing: EventListing;
  title: string;
};

export const EventsListByCategory = ({
  listing,
  title,
}: EventsListByCategoryProps) => {
  const { user: currentUser } = useCurrentUserStore();

  const listInnerRef = useRef<HTMLDivElement>(null);

  const {
    events,
    isLoading: isLoadingEvents,
    keyword,
    filter,
    favoriteEventsIds,
    fetchMore,
    setFilter,
    setKeyword,
  } = useEvents({ listing });

  const { registerToEvent: onRegisterToEvent } = useEventAction();

  const [registerEvent, setRegisterEvent] = useState<EventResponse | null>(
    null
  );

  const [isRegLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);

  const checkIsFreeEvent = (event: EventResponse) => {
    eventsApi.getTicket(event.id).then(({ data }) => {
      const ticket = data.find(
        (ticket) => ticket.ticketPriceId === event.singleClickTicketPriceId
      );
      if (ticket && ticket.amount === 0) {
        registerToEvent(event);
      } else {
        setRegisterEvent(event);
      }
    });
  };

  const registerToEvent = (registerEvent: EventResponse) => {
    if (registerEvent?.singleClickTicketPriceId && currentUser) {
      onRegisterToEvent(
        registerEvent.singleClickTicketPriceId,
        currentUser.id
      ).then(() => {
        setRegisterEvent(null);
        finishLoading();
      });
    }
  };

  const handleScroll = () => {
    const scrollTop = listInnerRef.current?.scrollTop || 0;
    const scrollHeight = listInnerRef.current?.scrollHeight || 0;
    const clientHeight = listInnerRef.current?.clientHeight || 0;

    if (scrollHeight - scrollTop - clientHeight < 100) {
      fetchMore();
    }
  };

  return (
    <S.StackContainer ref={listInnerRef} onScroll={handleScroll}>
      <Stack vertical>
        <Stack alignment="center" distribution="equalSpacing">
          <Title level={4}>{title}</Title>
        </Stack>

        <Stack alignment="center" distribution="equalSpacing" wrap={false}>
          <Stack.Item fill>
            <SearchBar
              value={keyword}
              placeholder="Search"
              style={{ maxWidth: 300 }}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Stack.Item>

          <Stack>
            <EventsFilter
              initialFilter={filter}
              onChangeFilter={(newFilter) =>
                setFilter({ listing, ...newFilter })
              }
            />
          </Stack>
        </Stack>

        <Stack vertical distribution="equalSpacing">
          {events?.map((item) => {
            return (
              <EventComponent
                {...item}
                action={
                  item.isSingleClickRegistration && (
                    <Button
                      loading={isRegLoading}
                      onClick={() => {
                        startLoading();
                        checkIsFreeEvent(item);
                      }}
                    >
                      Register
                    </Button>
                  )
                }
                bookmark={
                  <EventBookmark
                    initIsFavorite={
                      favoriteEventsIds?.includes(item?.id) || false
                    }
                    eventId={item.id}
                  />
                }
              />
            );
          })}
        </Stack>

        {!isLoadingEvents && events?.length === 0 && (
          <Empty description="No events" />
        )}

        {isLoadingEvents && (
          <div style={{ padding: 50 }}>
            <Stack vertical alignment="center">
              <Spin spinning size="large" />
            </Stack>
          </div>
        )}
      </Stack>

      <ConfirmModal
        isOpen={!!registerEvent}
        title="Proceed to checkout?"
        description="This is a paid event and requires payment now to ensure your spot is reserved. Proceed to ticket checkout?"
        confirmButtonText="Register"
        isLoading={isRegLoading}
        onClose={() => {
          setRegisterEvent(null);
          finishLoading();
        }}
        onConfirm={() => registerEvent && registerToEvent(registerEvent)}
      />
    </S.StackContainer>
  );
};
