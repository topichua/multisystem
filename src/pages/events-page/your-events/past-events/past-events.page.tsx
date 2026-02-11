import { useRef } from 'react';
import { ClockRewind } from '@untitled-ui/icons-react';
import { Col, Empty, Row, Spin, Typography } from 'antd';

import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { components } from 'src/styled/definitions/colors';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';

import { useUserEvents } from '../../events-home/__hooks/useUserEvents';
import { EventComponent } from '../../events-home/__components/event-components/event-component';

import * as S from './past-events.styled';
import { EventBookmark } from 'src/components/common/Events/EventsBookmark.tsx';

const { Text } = Typography;

export const EventsPastEventsPage = () => {
  const listInnerRef = useRef<HTMLDivElement>(null);

  const {
    events,
    tickets,
    favoriteEventsIds,
    isLoading,
    totalTickets,
    fetchMore,
  } = useUserEvents({
    size: 20,
    eventsType: 'past',
  });

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
          icon={<ClockRewind color={components.colors.brandColor} />}
          title="Past events"
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
              <Title level={5}>Past</Title>
              <Text type="secondary">{totalTickets} events</Text>
            </Stack>

            <Row gutter={[16, 16]}>
              {tickets?.map((ticket) => (
                <Col key={ticket.ticketId} xl={6} md={8} sm={12} xs={24}>
                  <EventComponent
                    {...events[ticket.eventId]}
                    vertical
                    ticket={ticket}
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
              ))}
            </Row>
          </Stack>

          {isLoading && <Spin spinning size="large" />}
          {tickets?.length === 0 && !isLoading && (
            <Empty
              description="No past events yet"
              style={{ paddingTop: 24 }}
            />
          )}
        </Page.Content>
      </S.StackContainer>
    </>
  );
};
