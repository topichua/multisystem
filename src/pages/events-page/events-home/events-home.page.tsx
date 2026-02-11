import { useBoolean } from 'ahooks';
import { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  DotsVertical,
  Ticket01,
} from '@untitled-ui/icons-react';
import { CheckCircleFilled } from '@ant-design/icons';

import { Col, Dropdown, Empty, Row, Spin } from 'antd';
import { observer } from 'mobx-react';

import { Page } from 'src/components/common/page/page';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Stack } from 'src/components/common/Stack/Stack';
import { components } from 'src/styled/definitions/colors';
import { Title } from 'src/components/common/Typography/Title';
import { InternalLink } from 'src/components/common/Link/Link';
import { Divider } from 'src/components/common/Divider/Divider';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { pagesMap } from 'src/pages/authorized/routes';
import dayjs from 'dayjs';
import { eventsApi } from 'src/transport/events/events.api.ts';

import { EventComponent } from './__components/event-components/event-component';
import { useEvents } from './__hooks/useEvents';
import { useUserEvents } from './__hooks/useUserEvents';

import * as S from './events-home.styled';
import { Button } from 'src/components/common/Button/Button';
import { EventResponse, Ticket } from 'src/transport/events/events.dto';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
import { CancelTicketModal } from './__components/cancel-ticket-modal/cancel-ticket-modal';
import {
  NominateTicketModal,
  NominateTicketValues,
} from './__components/nominate-ticket-modal/nominate-ticket-modal';
import { useEventAction } from './__hooks/useEventAction';
import {
  EventDietaryModal,
  EventDietaryValue,
} from './__components/event-dietary-modal/event-dietary-modal';
import _take from 'lodash/take';
import { useEventsDiscoverPath } from '../__hooks/useRoutes';

export const EventsHomePage = observer(() => {
  const { user: currentUser } = useCurrentUserStore();
  const {
    events,
    isLoading: isLoadingEvents,
    // fetchMore
  } = useEvents();

  // const listInnerRef = useRef<HTMLDivElement>(null);
  const discoverCpdAndEventsPath = useEventsDiscoverPath();

  const {
    isCancelTicketLoading,
    isNominateTicketLoading,
    isChangeTicketLoading,
    nominateTicket: onNominateTicket,
    cancelTicket: onCancelTicket,
    registerToEvent: onRegisterToEvent,
    changeTicketDietary: onChangeTicketDietary,
  } = useEventAction();

  const [registerEvent, setRegisterEvent] = useState<EventResponse | null>(
    null
  );
  const [isRegLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);

  const [
    selectedTicketToCancelRegistration,
    setSelectedTicketToCancelRegistration,
  ] = useState<Ticket | null>(null);

  const [selectedTicketForCancel, setSelectedTicketForCancel] =
    useState<Ticket | null>(null);
  const [selectedTicketForNominate, setSelectedTicketForNominate] =
    useState<Ticket | null>(null);
  const [selectedTicketForDietary, setSelectedTicketForDietary] =
    useState<Ticket | null>(null);

  const {
    isLoading: isUpcomingEventsLoading,
    events: upcomingEvents,
    tickets,
    refetch,
  } = useUserEvents({});

  const changeTicketDietary = (data: EventDietaryValue) => {
    onChangeTicketDietary({
      ...data,
      ticketId: selectedTicketForDietary?.ticketId as string,
    }).then(() => {
      refetch();
      setSelectedTicketForDietary(null);
    });
  };

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
        refetch();
        setRegisterEvent(null);
        finishLoading();
      });
    }
  };

  const cancelTicket = () => {
    if (selectedTicketForCancel) {
      onCancelTicket(selectedTicketForCancel.ticketId).then((isSuccess) => {
        if (!isSuccess) return;

        refetch();
        setSelectedTicketForCancel(null);
        setSelectedTicketToCancelRegistration(null);
      });
    }
  };

  const nominateTicket = (data: NominateTicketValues) => {
    if (selectedTicketForNominate) {
      onNominateTicket({
        ticketId: selectedTicketForNominate.ticketId,
        ...data,
      }).then((isSuccess) => {
        if (!isSuccess) return;

        refetch();
        setSelectedTicketForNominate(null);
        setSelectedTicketToCancelRegistration(null);
      });
    }
  };

  // const handleScroll = () => {
  //   const scrollTop = listInnerRef.current?.scrollTop || 0;
  //   const scrollHeight = listInnerRef.current?.scrollHeight || 0;
  //   const clientHeight = listInnerRef.current?.clientHeight || 0;

  //   if (scrollHeight - scrollTop - clientHeight < 100) {
  //     fetchMore();
  //   }
  // };

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<Calendar color={components.colors.brandColor} />}
          title="Home"
        />
      </FixedContentHeader>
      <S.StackContainer>
        <Page.Content
          style={{
            maxWidth: 1064,
            minHeight: 500,
            margin: '0 auto',
          }}
        >
          <Stack
            alignment="center"
            distribution="equalSpacing"
            style={{ marginBottom: '12px' }}
          >
            <Title level={4}>My upcoming events</Title>
            <InternalLink href={pagesMap.eventsAttending}>See all</InternalLink>
          </Stack>
          <Spin spinning={isUpcomingEventsLoading} size="large">
            <Row gutter={[16, 16]}>
              {_take(tickets, 2)?.map((item) => {
                const canCanceled =
                  item.attendanceStatus !== 'Removed' &&
                  dayjs(item.eventStart).isAfter(dayjs().add(14, 'day'));

                return (
                  <Col key={item.ticketId} span={24}>
                    <EventComponent
                      {...upcomingEvents[item.eventId]}
                      action={
                        <Stack
                          spacing="tight"
                          wrap={false}
                          distribution="trailing"
                        >
                          {canCanceled && (
                            <Dropdown
                              menu={{
                                items: [
                                  {
                                    key: '1',
                                    label: 'Cancel registration',
                                    onClick: () =>
                                      setSelectedTicketToCancelRegistration(
                                        item
                                      ),
                                  },
                                  {
                                    key: '2',
                                    label: 'Dietary & special requirements',
                                    onClick: () =>
                                      setSelectedTicketForDietary(item),
                                  },
                                ],
                              }}
                              trigger={['click']}
                            >
                              <Button
                                rightIcon={
                                  <ChevronDown width={16} height={16} />
                                }
                                icon={
                                  <CheckCircleFilled
                                    style={{ color: '#079455' }}
                                  />
                                }
                              >
                                Going
                              </Button>
                            </Dropdown>
                          )}

                          <Button type="text">
                            <DotsVertical width={16} height={16} />
                          </Button>
                        </Stack>
                      }
                    />
                  </Col>
                );
              })}
            </Row>

            {!isUpcomingEventsLoading && tickets?.length === 0 && (
              <Empty description="No events yet" />
            )}
          </Spin>

          <Divider />

          <Stack vertical style={{ minHeight: '50vh' }}>
            <Stack alignment="center" distribution="equalSpacing">
              <Title level={4}>Discover CPD & Events</Title>
              <InternalLink href={discoverCpdAndEventsPath}>
                See all
              </InternalLink>
            </Stack>

            <Row gutter={[16, 16]}>
              {_take(events, 4)?.map((item) => {
                return (
                  <Col key={item.id} xl={6} md={8} sm={12} xs={24}>
                    <EventComponent
                      {...item}
                      vertical={true}
                      action={
                        item.isSingleClickRegistration && (
                          <div style={{ width: 'auto' }}>
                            <Button
                              block
                              loading={isRegLoading}
                              icon={<Ticket01 width={16} height={16} />}
                              onClick={() => {
                                startLoading();
                                checkIsFreeEvent(item);
                              }}
                            >
                              Register
                            </Button>
                          </div>
                        )
                      }
                    />
                  </Col>
                );
              })}
            </Row>
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
        </Page.Content>

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

        <CancelTicketModal
          open={!!selectedTicketToCancelRegistration}
          onCancel={() => setSelectedTicketToCancelRegistration(null)}
          onNominateTicket={() =>
            setSelectedTicketForNominate(selectedTicketToCancelRegistration)
          }
          onCancelTicket={() =>
            setSelectedTicketForCancel(selectedTicketToCancelRegistration)
          }
        />

        <ConfirmModal
          isOpen={!!selectedTicketForCancel}
          title="Cancel ticket?"
          confirmButtonText="Refund"
          confirmButtonProps={{ danger: true }}
          isLoading={isCancelTicketLoading}
          onClose={() => setSelectedTicketForCancel(null)}
          onConfirm={cancelTicket}
        />

        <NominateTicketModal
          open={!!selectedTicketForNominate}
          isLoading={isNominateTicketLoading}
          onCancel={() => setSelectedTicketForNominate(null)}
          onNominateTicket={nominateTicket}
        />

        <EventDietaryModal
          open={!!selectedTicketForDietary}
          ticket={selectedTicketForDietary}
          isLoading={isChangeTicketLoading}
          onCancel={() => setSelectedTicketForDietary(null)}
          onChange={changeTicketDietary}
        />
      </S.StackContainer>
    </>
  );
});
