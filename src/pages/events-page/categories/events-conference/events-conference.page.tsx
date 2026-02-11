import { Briefcase01 } from '@untitled-ui/icons-react';
import { Empty } from 'antd';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { components } from 'src/styled/definitions/colors';

export const EventsConferencePage = () => {
  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<Briefcase01 color={components.colors.brandColor} />}
          title="Conference"
        />
      </FixedContentHeader>
      <Empty description="Work in progress" style={{ paddingTop: 24 }} />
    </>
  );
};
