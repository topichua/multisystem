import { useRef, useState } from 'react';
import { CalendarCheck01 } from '@untitled-ui/icons-react';
import { Col, Dropdown, Empty, Row, Spin, Typography } from 'antd';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { components } from 'src/styled/definitions/colors';
import { Title } from 'src/components/common/Typography/Title';
import { Stack } from 'src/components/common/Stack/Stack';

import { useUserEvents } from '../../events-home/__hooks/useUserEvents';
import { EventComponent } from '../../events-home/__components/event-components/event-component';

import * as S from './events-attending.styled';
import { Ticket } from 'src/transport/events/events.dto';
import { CancelTicketModal } from '../../events-home/__components/cancel-ticket-modal/cancel-ticket-modal';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';
import {
  NominateTicketModal,
  NominateTicketValues,
} from '../../events-home/__components/nominate-ticket-modal/nominate-ticket-modal';
import { Button } from 'src/components/common/Button/Button';
import dayjs from 'dayjs';
import { useEventAction } from '../../events-home/__hooks/useEventAction';
import {
  EventDietaryModal,
  EventDietaryValue,
} from '../../events-home/__components/event-dietary-modal/event-dietary-modal';
import { EventBookmark } from 'src/components/common/Events/EventsBookmark.tsx';

const { Text } = Typography;

export const EventsAttendingPage = () => {
  const listInnerRef = useRef<HTMLDivElement>(null);

  const {
    events,
    tickets,
    favoriteEventsIds,
    isLoading,
    totalTickets,
    fetchMore,
    changeTicket,
  } = useUserEvents({
    size: 20,
  });

  const {
    isCancelTicketLoading,
    isNominateTicketLoading,
    isChangeTicketLoading,
    nominateTicket: onNominateTicket,
    cancelTicket: onCancelTicket,
    changeTicketDietary: onChangeTicketDietary,
  } = useEventAction();

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

  const changeTicketDietary = (data: EventDietaryValue) => {
    onChangeTicketDietary({
      ...data,
      ticketId: selectedTicketForDietary?.ticketId as string,
    }).then(() => {
      changeTicket(data, selectedTicketForDietary?.ticketId as string);
      setSelectedTicketForDietary(null);
    });
  };

  const cancelTicket = () => {
    if (selectedTicketForCancel) {
      onCancelTicket(selectedTicketForCancel.ticketId).then((isSuccess) => {
        if (isSuccess) {
          changeTicket(
            { attendanceStatus: 'Removed' },
            selectedTicketForCancel.ticketId
          );
          setSelectedTicketForCancel(null);
          setSelectedTicketToCancelRegistration(null);
        }
      });
    }
  };

  const nominateTicket = (data: NominateTicketValues) => {
    if (selectedTicketForNominate) {
      onNominateTicket({
        ticketId: selectedTicketForNominate.ticketId,
        ...data,
      }).then((isSuccess) => {
        if (isSuccess) {
          setSelectedTicketToCancelRegistration(null);
          setSelectedTicketForNominate(null);
        }
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
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<CalendarCheck01 color={components.colors.brandColor} />}
          title="My Events"
        />
      </FixedContentHeader>

      <S.StackContainer ref={listInnerRef} onScroll={handleScroll}>
        <Page.Content
          style={{
            maxWidth: 1064,
            minHeight: 500,
            margin: '0 auto',
          }}
        >
          <Stack vertical spacing="extraLoose">
            <Stack vertical spacing="none">
              <Title level={5}>Going</Title>
              <Text type="secondary">{totalTickets} events</Text>
            </Stack>

            <Row gutter={[16, 16]}>
              {tickets?.map((ticket) => {
                const canCanceled =
                  ticket.attendanceStatus !== 'Removed' &&
                  dayjs(ticket.eventStart).isAfter(dayjs().add(14, 'day'));

                return (
                  <Col key={ticket.ticketId} xl={6} md={8} sm={12} xs={24}>
                    <EventComponent
                      {...events[ticket.eventId]}
                      vertical
                      ticket={ticket}
                      action={
                        canCanceled && (
                          <Dropdown
                            menu={{
                              items: [
                                {
                                  key: '1',
                                  label: 'Cancel registration',
                                  onClick: () =>
                                    setSelectedTicketToCancelRegistration(
                                      ticket
                                    ),
                                },
                                {
                                  key: '2',
                                  label: 'Dietary & special requirements',
                                  onClick: () =>
                                    setSelectedTicketForDietary(ticket),
                                },
                              ],
                            }}
                            trigger={['click']}
                          >
                            <Button block>More</Button>
                          </Dropdown>
                        )
                      }
                      bookmark={
                        <EventBookmark
                          initIsFavorite={
                            favoriteEventsIds?.includes(ticket.eventId) || false
                          }
                          eventId={ticket.eventId}
                        />
                      }
                    />
                  </Col>
                );
              })}
            </Row>
          </Stack>

          {isLoading && <Spin spinning size="large" />}
          {tickets?.length === 0 && !isLoading && (
            <Empty
              description="No upcoming events yet"
              style={{ paddingTop: 24 }}
            />
          )}
        </Page.Content>
      </S.StackContainer>

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
    </>
  );
};
