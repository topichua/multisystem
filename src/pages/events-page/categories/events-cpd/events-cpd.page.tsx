import { Certificate01 } from '@untitled-ui/icons-react';

import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { components } from 'src/styled/definitions/colors';

import { EventsListByCategory } from '../../__components/events-list-by-category/events-list-by-category';

export const EventsCpdPage = () => {
  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<Certificate01 color={components.colors.brandColor} />}
          title="CPD"
        />
      </FixedContentHeader>

      <EventsListByCategory listing="cpd" title="Discover CPD" />
    </>
  );
};
