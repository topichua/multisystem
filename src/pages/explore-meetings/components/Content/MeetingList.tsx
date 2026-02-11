import { VideoRecorder } from '@untitled-ui/icons-react';
import { Button, Empty, Typography } from 'antd';
import { observer } from 'mobx-react';
import { MeetingCard } from 'src/components/common/MeetingCard/MeetingCard.tsx';
import MeetingStatusDropdown from 'src/components/common/MeetingCard/MeetingStatusDropdown.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { useMeetingRef } from 'src/pages/community-pages/community-details/__hooks/useMeetingRef.ts';
import { useScrollToMeeting } from 'src/pages/community-pages/community-details/__hooks/useScrollToMeeting.ts';
import MeetingCardHeader from 'src/pages/explore-meetings/components/Content/MeetingCardHeader.tsx';
import { useExploreMeetingsStore } from 'src/pages/explore-meetings/explore-meetings.provider.tsx';

const { Text } = Typography;

export const MeetingList = observer(() => {
  const { allCommunities, updateMeetingStatus, isMeetingsLoading, meetings } =
    useExploreMeetingsStore();

  const highlightedId = useScrollToMeeting(isMeetingsLoading);
  const { getMeetingRef } = useMeetingRef();

  return (
    <Stack vertical wrap={false}>
      {meetings?.length
        ? meetings.map(({ meet, status, isFavorite }) => (
            <MeetingCard
              isHighlighted={meet.id === highlightedId}
              key={meet.id}
              ref={getMeetingRef(meet.id, location)}
              meeting={meet}
              communityId={meet.communityId}
              isFavorite={isFavorite}
              cardHeader={
                <MeetingCardHeader
                  communityData={allCommunities.find(
                    (c) => c.id === meet.communityId
                  )}
                />
              }
            >
              <Stack alignment="center">
                {meet.meetingLink && (
                  <Stack spacing="none" alignment="trailing">
                    <MeetingStatusDropdown
                      meet={meet}
                      status={status}
                      updateMeetingStatus={updateMeetingStatus}
                      communityId={meet.communityId}
                      isFavorite={isFavorite}
                    />
                    <Button type="link" href={meet.meetingLink} target="_blank">
                      <VideoRecorder height={20} />
                      <Text strong> Join meeting</Text>
                    </Button>
                  </Stack>
                )}
              </Stack>
            </MeetingCard>
          ))
        : !isMeetingsLoading && <Empty />}
    </Stack>
  );
});

export default MeetingList;
