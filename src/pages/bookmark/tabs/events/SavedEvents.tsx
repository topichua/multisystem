import { useBoolean } from 'ahooks';
import { Empty, Row, Spin } from 'antd';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal.tsx';
import { Page } from 'src/components/common/page/page.tsx';
import * as H from 'src/pages/bookmark/tabs/events/useEventsList.ts';
import * as S from 'src/pages/events-page/events-page.styled.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { EventComponent } from 'src/pages/events-page/events-home/__components/event-components/event-component.tsx';
import { Button } from 'src/components/common/Button/Button.tsx';
import { EventBookmark } from 'src/components/common/Events/EventsBookmark.tsx';
import { eventsApi } from 'src/transport/events/events.api.ts';
import { EventResponse } from 'src/transport/events/events.dto.ts';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout.tsx';
import { useEventAction } from 'src/pages/events-page/events-home/__hooks/useEventAction.ts';

export const SavedEvents = observer(() => {
  const { user: currentUser } = useCurrentUserStore();
  const { events, eventsResult, ref, toggleReload } = H.useEventsList();

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

  return (
    <S.StyledCardContainer>
      <Spin spinning={eventsResult.loading}>
        <S.StyledStack ref={ref} vertical align="center" gap={24} wrap={false}>
          <Page.Content
            style={{
              minHeight: 500,
              width: '100%',
              maxWidth: 1364,
            }}
          >
            <Row gutter={[16, 16]} wrap>
              {events?.length
                ? events.map((item) => {
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
                            initIsFavorite={true}
                            eventId={item.id}
                            toggleReload={toggleReload}
                          />
                        }
                      />
                    );
                  })
                : !eventsResult.loading && (
                    <Stack distribution="center" style={{ width: '100%' }}>
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No favorite events."
                      />
                    </Stack>
                  )}
            </Row>
          </Page.Content>
        </S.StyledStack>
      </Spin>

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
    </S.StyledCardContainer>
  );
});
