import { GlobeSlated02 } from '@untitled-ui/icons-react';
import { Empty, Spin } from 'antd';

import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { components } from 'src/styled/definitions/colors';
import { useEnrolments } from './hooks/useEnrolments';
import { Stack } from 'src/components/common/Stack/Stack';

import { EnrolledCard } from './components/enrolled-card';

export const CpdAllCoursesPage = () => {
  const { enrolments, isLoading, unenrolment } = useEnrolments();

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<GlobeSlated02 color={components.colors.brandColor} />}
          title="All courses"
        />
      </FixedContentHeader>
      <Page.Content style={{ minHeight: 500, width: 720, margin: '0 auto' }}>
        <Spin spinning={isLoading}>
          {enrolments.length > 0 ? (
            <Stack vertical spacing="extraLoose">
              {enrolments.map((enrolment) => (
                <EnrolledCard
                  key={enrolment.enrolmentId}
                  enrolment={enrolment}
                  onUnenrol={unenrolment}
                />
              ))}
            </Stack>
          ) : (
            !isLoading && <Empty />
          )}
        </Spin>
      </Page.Content>
    </>
  );
};
