import { VideoRecorder } from '@untitled-ui/icons-react';
import { Button, Empty, Spin, Typography } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useMemo } from 'react';
import { MeetingCard } from 'src/components/common/MeetingCard/MeetingCard.tsx';
import MeetingStatusDropdown from 'src/components/common/MeetingCard/MeetingStatusDropdown.tsx';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { useCommunityDetailsStore } from 'src/pages/community-pages/community-details/community-details.provider.tsx';
import { useMeetingRef } from '../__hooks/useMeetingRef';
import { useScrollToMeeting } from '../__hooks/useScrollToMeeting';

const { Text } = Typography;

export const CommunityDetailsMeetings = observer(() => {
  const {
    community,
    fetchMeetings,
    meetings,
    updateMeetingStatusLoading,
    meetingsLoading,
    communityId,
    communityAlias,
    updateMeetingStatus,
  } = useCommunityDetailsStore();

  const isLoading = useMemo(
    () => meetingsLoading || updateMeetingStatusLoading,
    [meetingsLoading, updateMeetingStatusLoading]
  );

  const highlightedId = useScrollToMeeting(isLoading);
  const { getMeetingRef } = useMeetingRef();

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  return (
    <Spin spinning={isLoading}>
      <Page.Content style={{ maxWidth: 650, margin: '0 auto' }}>
        <Stack vertical wrap={false}>
          {meetings?.length
            ? meetings?.map(({ meet, status, isFavorite }) => (
                <MeetingCard
                  isHighlighted={meet.id === highlightedId}
                  key={meet.id}
                  ref={getMeetingRef(meet.id, location)}
                  meeting={meet}
                  communityId={communityId}
                  communityAlias={communityAlias}
                  isFavorite={isFavorite}
                >
                  <Stack alignment="center">
                    {meet.meetingLink && (
                      <Stack spacing="none" alignment="trailing">
                        <MeetingStatusDropdown
                          meet={meet}
                          status={status}
                          updateMeetingStatus={updateMeetingStatus}
                          communityId={community?.id || ''}
                          isFavorite={isFavorite}
                        />
                        <Button
                          type="link"
                          href={meet.meetingLink}
                          target="_blank"
                        >
                          <VideoRecorder height={20} />
                          <Text strong> Join meeting</Text>
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </MeetingCard>
              ))
            : !isLoading && <Empty />}
        </Stack>
      </Page.Content>
    </Spin>
  );
});
