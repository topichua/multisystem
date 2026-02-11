import { BookOpen01 } from '@untitled-ui/icons-react';
import { Empty, Spin } from 'antd';

import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { components } from 'src/styled/definitions/colors';

import { EnrolledCard } from './components/enrolled-card';
import { useEnrolments } from './hooks/useEnrolments';

export const iconSize = {
  width: 14,
  height: 14,
};

export const CpdEnrolledPage = () => {
  const { enrolments, isLoading, unenrolment } = useEnrolments('Active');

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<BookOpen01 color={components.colors.brandColor} />}
          title="Enrolled"
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
