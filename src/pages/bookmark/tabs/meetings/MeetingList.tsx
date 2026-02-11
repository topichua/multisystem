import { VideoRecorder } from '@untitled-ui/icons-react';
import { Button, Empty, Typography } from 'antd';
import { observer } from 'mobx-react';
import { MeetingCard } from 'src/components/common/MeetingCard/MeetingCard.tsx';
import MeetingStatusDropdown from 'src/components/common/MeetingCard/MeetingStatusDropdown.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { useBookmarkStore } from 'src/pages/bookmark/bookmark.provider.tsx';
import { useMeetingRef } from 'src/pages/community-pages/community-details/__hooks/useMeetingRef';
import { useScrollToMeeting } from 'src/pages/community-pages/community-details/__hooks/useScrollToMeeting.ts';
import MeetingCardHeader from 'src/pages/explore-meetings/components/Content/MeetingCardHeader.tsx';

const { Text } = Typography;

export const MeetingList = observer(() => {
  const {
    allMeetingsCommunities,
    updateMeetingStatus,
    isMeetingsLoading,
    meetings,
    getAllMeetings,
  } = useBookmarkStore();

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
              reloadMeetings={() => getAllMeetings()}
              cardHeader={
                <MeetingCardHeader
                  communityData={allMeetingsCommunities.find(
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
