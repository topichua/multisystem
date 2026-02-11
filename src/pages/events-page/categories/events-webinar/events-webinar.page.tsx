import { VideoRecorder } from '@untitled-ui/icons-react';
import { Result } from 'antd';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { components } from 'src/styled/definitions/colors';

export const EventsWebinarPage = () => {
  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<VideoRecorder color={components.colors.brandColor} />}
          title="Webinar"
        />
      </FixedContentHeader>
      <Page.Content style={{ width: 1064, minHeight: 500, margin: '0 auto' }}>
        <Result
          status="500"
          title="Oops!"
          subTitle="Sorry, page is under construction!"
        />
      </Page.Content>
    </>
  );
};
