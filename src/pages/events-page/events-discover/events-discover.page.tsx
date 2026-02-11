/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEventsStore } from '../events.page.provider';
import { useEventsDiscoverPath } from '../__hooks/useRoutes';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { Stack } from 'src/components/common/Stack/Stack';
import { TotalCountAndAdditionalFilters } from './total-count-and-additional-filters';
import { SelectedFilterItems } from './selected-filter-items';
import { Empty, Pagination, PaginationProps, Row, Spin } from 'antd';
import { StyledCol } from 'src/pages/news-and-resources/news-card-list.styled';
import { EventComponent } from '../events-home/__components/event-components/event-component';
import { StackContainer } from '../__components/events-list-by-category/events-list-by-category.styled';
import EventsRegisterButton from '../events-home/events-register-button';
import { useUserEvents } from '../events-home/__hooks/useUserEvents';

export const EventsDiscoverPageContent = observer(() => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const rootStore = useEventsStore();
  const pathDiscoverAllCpdAndEvents = useEventsDiscoverPath();
  const pathDiscoverFilteredCpdAndEvents = useEventsDiscoverPath(true);
  const eventListRef = useRef<HTMLDivElement>(null);

  const {
    isLoadingEvents,
    fetchAllEventsDebounced,
    eventsListMap,
    currentPageEvents,
    totalEvents,
    currentPage,
    pageSize,
    setEventsNumericalValue,
    clearMapsAndSets,
  } = rootStore.eventsStore;
  const {
    eventsQueryString,
    syncEventFiltersFromQuery,
    resetSelectedFilters,
    payloadForFetchingEvents,
  } = rootStore.eventsFilterStore;

  const { refetch } = useUserEvents({});

  const handlePageChange: PaginationProps['onChange'] = (newCurrentPage) => {
    setEventsNumericalValue('currentPage', newCurrentPage);
  };

  useEffect(() => {
    return () => {
      resetSelectedFilters();
    };
  }, []);

  useEffect(() => {
    /*
     * * Since we're using StyledCol, it has CSS animation with a bit of delay.
     * * Calculate the maximum delay based on the last item's $id or index
     * * and then call scrollTo function after the determined timeout value
     */
    const maxDelay = currentPageEvents.length * 0.1; // max delay = last item $id * 0.1s

    const timer = setTimeout(() => {
      if (eventListRef?.current) {
        eventListRef?.current?.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }, maxDelay * 100);

    return () => clearTimeout(timer);
  }, [currentPageEvents]);

  useEffect(() => {
    syncEventFiltersFromQuery(searchParams);
    fetchAllEventsDebounced(payloadForFetchingEvents);
  }, [searchParams]);

  useEffect(() => {
    if (!eventsQueryString) {
      navigate(pathDiscoverAllCpdAndEvents);
    } else {
      navigate(`${pathDiscoverFilteredCpdAndEvents}?${eventsQueryString}`);
    }

    clearMapsAndSets();
  }, [eventsQueryString]);

  useEffect(() => {
    fetchAllEventsDebounced(payloadForFetchingEvents);
  }, [payloadForFetchingEvents, currentPage]);

  return (
    <div>
      <FixedContentHeader>
        <Stack spacing="none" vertical>
          <TotalCountAndAdditionalFilters />
          <SelectedFilterItems />
        </Stack>
      </FixedContentHeader>

      <StackContainer ref={eventListRef}>
        {isLoadingEvents ? (
          <div style={{ padding: 50 }}>
            <Stack vertical alignment="center">
              <Spin spinning size="large" />
            </Stack>
          </div>
        ) : (
          <Stack
            vertical
            distribution="equalSpacing"
            style={{ marginTop: '24px' }}
          >
            <Row gutter={[16, 16]} wrap>
              {currentPageEvents.map((item, index) => (
                <StyledCol
                  key={item.id}
                  xl={6}
                  md={8}
                  sm={12}
                  xs={24}
                  $id={index}
                >
                  <EventComponent
                    {...item}
                    vertical={true}
                    action={
                      item.isSingleClickRegistration && (
                        <EventsRegisterButton
                          event={item}
                          refetchUserEvents={refetch}
                        />
                      )
                    }
                  />
                </StyledCol>
              ))}
            </Row>
          </Stack>
        )}

        {!isLoadingEvents && eventsListMap.size > 0 && (
          <Stack
            style={{ margin: '40px 0', height: '69px' }}
            distribution="center"
          >
            <Pagination
              current={currentPage}
              total={totalEvents}
              onChange={handlePageChange}
              align="center"
              disabled={isLoadingEvents}
              defaultPageSize={pageSize}
              showSizeChanger={false}
              showTotal={(total, range) =>
                `${range[0]} - ${range[1]} of ${total} items`
              }
              hideOnSinglePage
            />
          </Stack>
        )}

        {!isLoadingEvents && !eventsListMap.size && (
          <Stack distribution="center" style={{ width: '100%' }}>
            <Empty description="No events available" />
          </Stack>
        )}
      </StackContainer>
    </div>
  );
});
