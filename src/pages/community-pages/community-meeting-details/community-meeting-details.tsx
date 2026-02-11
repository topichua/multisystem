import { VideoRecorder } from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import { Empty, Spin, Typography, notification, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import { MeetingCard } from 'src/components/common/MeetingCard/MeetingCard';
import MeetingStatusDropdown from 'src/components/common/MeetingCard/MeetingStatusDropdown';
import { Stack } from 'src/components/common/Stack/Stack';
import { Page } from 'src/components/common/page/page';
import { communityApi } from 'src/transport/communities/communities.api';
import { MeetStatus } from 'src/transport/communities/communities.dto';

import { useCommunityDetailsStore } from '../community-details/community-details.provider';

import * as S from './community-meeting-details.styled';

const { Text } = Typography;

export const CommunityMeetingDetails = observer(() => {
  const { id: meetingId } = useParams();

  const { communityId, communityAlias } = useCommunityDetailsStore();

  const [meeting, setMeeting] = useState<MeetStatus | null>(null);
  const [isLoadingLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);

  useEffect(() => {
    fetchMeeting();
  }, []);

  const fetchMeeting = () => {
    if (!meetingId || !communityId) return;

    startLoading();

    communityApi
      .getMeetingById(communityId, meetingId)
      .then((res) => {
        setMeeting(res.meet);
      })
      .catch((e) => {
        notification.error({ message: `Failed to load meeting:, ${e}` });
      })
      .finally(finishLoading);
  };

  const updateMeetingStatus = async (
    communityId: string,
    meetingId: string,
    newStatus: string
  ) => {
    startLoading();

    return communityApi
      .updateMeetingStatus(communityId, meetingId, newStatus)
      .then(() => {
        setMeeting({ ...(meeting as MeetStatus), status: Number(newStatus) });
      })
      .finally(finishLoading);
  };

  return (
    <Spin spinning={isLoadingLoading}>
      <Page.Content
        style={{ maxWidth: 650, margin: '0 auto', minHeight: 'auto' }}
      >
        <Stack vertical spacing="loose">
          {!meeting ? (
            !isLoadingLoading && <Empty />
          ) : (
            <MeetingCard
              meeting={meeting.meet}
              communityId={communityId || ''}
              communityAlias={communityAlias}
              isFavorite={meeting.isFavorite}
              disableCollapsing
            >
              <Stack alignment="center">
                {meeting.meet.meetingLink && (
                  <Stack spacing="none" alignment="trailing">
                    <MeetingStatusDropdown
                      meet={meeting.meet}
                      status={meeting.status}
                      updateMeetingStatus={updateMeetingStatus}
                      communityId={communityId || ''}
                      isFavorite={meeting.isFavorite}
                    />
                    <Button
                      type="link"
                      href={meeting.meet.meetingLink}
                      target="_blank"
                    >
                      <VideoRecorder height={20} />
                      <Text strong> Join meeting</Text>
                    </Button>
                  </Stack>
                )}
              </Stack>
            </MeetingCard>
          )}

          <S.LinkStyled to={`/communities/${communityAlias}/meetings`}>
            See all meetings
          </S.LinkStyled>
        </Stack>
      </Page.Content>
    </Spin>
  );
});
