import _isEmpty from 'lodash/isEmpty';
import { Col, Row, Upload, Skeleton, Empty } from 'antd';

import { Stack } from 'src/components/common/Stack/Stack';
import { Page } from 'src/components/common/page/page';
import { Card } from 'src/components/common/Card/Card';

import { SingleEventHeaderComponent } from './__components/single-event-header-component/single-event-header-component';
import { useEvent } from './__hooks/useEvents';
import { Registration } from './__components/registration/registration';
import { Sessions } from './__components/sessions/sessions';
import { WhoCanEnroll } from './__components/who-can-enroll/who-can-enroll';
import { AboutSection } from './__components/about-section/about-section';
import { EventPresenters } from './__components/event-presenters/event-presenters';
import { CourseContent } from './__components/course-content/course-content';
import { Sponsorship } from './__components/sponsorship/sponsorship';
import { AdditionalInfo } from './__components/additional-info/additional-info';
import { CpdDetails } from './__components/cpd-details/cpd-details';

export const SingleEventPage = () => {
  const { isLoading, event, tickets, attachments } = useEvent();

  const openLink = (linkTo?: string) => {
    if (!linkTo) return;

    const validLink =
      linkTo.startsWith('http://') || linkTo.startsWith('https://')
        ? linkTo
        : `https://${linkTo}`;

    window.open(validLink, '_blank');
  };

  if (isLoading || !event)
    return (
      <Page.Content>
        <Skeleton active />
      </Page.Content>
    );

  return (
    <Page.Content>
      <Stack vertical>
        <SingleEventHeaderComponent {...event} />

        <Row gutter={[16, 16]}>
          <Col lg={16} xs={24}>
            <Stack vertical>
              <AboutSection
                content={event.content}
                type={event.type}
                venue={event.address}
                externalUrl={event.externalUrl}
              />

              <Sessions sessions={event?.sessions} shortDescription={''} />

              {!_isEmpty(event?.canEnrolLayout) && (
                <WhoCanEnroll
                  sectionDescription={event.canEnrolContent ?? ''}
                  canEnrollLayout={event.canEnrolLayout}
                />
              )}

              {!_isEmpty(event?.coursesLayout) && (
                <CourseContent courses={event.coursesLayout} />
              )}

              {!_isEmpty(event?.sponsorContent) && (
                <Sponsorship sponsorContent={event.sponsorContent ?? '-'} />
              )}

              {(!_isEmpty(event?.reasoningContent) ||
                !_isEmpty(event?.accessContent)) && (
                <AdditionalInfo
                  reasoningContent={event.reasoningContent}
                  accessContent={event.accessContent}
                />
              )}
            </Stack>
          </Col>

          <Col lg={8} xs={24}>
            <Stack vertical>
              <Registration tickets={tickets} />

              <Card title="Attachments">
                {attachments.length === 0 ? (
                  <Empty description="No attachments yet" />
                ) : (
                  <Upload
                    showUploadList={{
                      showDownloadIcon: true,
                      showRemoveIcon: false,
                    }}
                    fileList={attachments.map((attachment) => ({
                      name: attachment.label,
                      url: attachment.url,
                      uid: attachment.url,
                      status: 'done',
                    }))}
                    onDownload={(res) => openLink(res.url)}
                    onPreview={(res) => openLink(res.url)}
                  />
                )}
              </Card>

              {!_isEmpty(event.presenters) && (
                <EventPresenters presenters={event.presenters} />
              )}

              {!_isEmpty(event.cpdDetails) && (
                <CpdDetails cpdDetails={event.cpdDetails} />
              )}
            </Stack>
          </Col>
        </Row>
      </Stack>
    </Page.Content>
  );
};
