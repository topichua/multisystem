import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { InternalLink } from 'src/components/common/Link/Link.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { Title } from 'src/components/common/Typography/Title.tsx';
import { pagesMap } from 'src/pages/authorized/routes.tsx';
import BlockLoading from 'src/pages/home-page/__components/SideBlock/block-loading.tsx';
import { useEvents } from 'src/pages/home-page/hooks';
import * as CS from '../side-block.styled.ts';
import * as S from './events.styles.ts';

const UpcomingEvents = () => {
  const { events, isLoading: isEventsLoading } = useEvents();
  const navigate = useNavigate();

  return (
    <S.UpcomingEvents>
      <Title level={4}>Upcoming Events</Title>
      {isEventsLoading ? (
        <BlockLoading />
      ) : (
        events.map((event) => (
          <S.EventStack
            distribution="equalSpacing"
            alignment="center"
            wrap={false}
          >
            <S.EventTitleContainer alignment="center" wrap={false}>
              {event.eventStartUtc && (
                <S.DayWrapper>
                  <S.DayWrapperLine />
                  {dayjs(event.eventStartUtc).date()}
                </S.DayWrapper>
              )}
              <Stack.Item ellipsis>
                <S.EventTitle>{event.title}</S.EventTitle>
              </Stack.Item>
            </S.EventTitleContainer>
            <S.ArrowIcon
              color="#98A2B3"
              onClick={() => navigate(`${pagesMap.events}/${event.id}`)}
            />
          </S.EventStack>
        ))
      )}
      <InternalLink href={pagesMap.events}>
        <CS.LinkText>View all events</CS.LinkText>{' '}
      </InternalLink>
    </S.UpcomingEvents>
  );
};

export default UpcomingEvents;
