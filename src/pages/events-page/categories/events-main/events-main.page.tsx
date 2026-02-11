import { Users03 } from '@untitled-ui/icons-react';

import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { components } from 'src/styled/definitions/colors';

import { EventsListByCategory } from '../../__components/events-list-by-category/events-list-by-category';

export const EventsMainPage = () => {
  //   const {
  //     events,
  //     isLoading: isLoadingEvents,
  //     keyword,
  //     filter,
  //     fetchMore,
  //     setFilter,
  //     setKeyword,
  //   } = useEvents({ listing: 'events' });

  //   const handleScroll = () => {
  //     const scrollTop = listInnerRef.current?.scrollTop || 0;
  //     const scrollHeight = listInnerRef.current?.scrollHeight || 0;
  //     const clientHeight = listInnerRef.current?.clientHeight || 0;

  //     if (scrollHeight - scrollTop - clientHeight < 100) {
  //       fetchMore();
  //     }
  //   };

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<Users03 color={components.colors.brandColor} />}
          title="Events"
        />
      </FixedContentHeader>

      <EventsListByCategory listing="events" title="Discover events" />
    </>
  );
};
