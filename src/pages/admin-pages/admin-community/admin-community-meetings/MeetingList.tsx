import { Empty } from 'antd';
import { observer } from 'mobx-react';
import { MeetingCard } from 'src/components/common/MeetingCard/MeetingCard';
import MeetingResonded from 'src/components/common/MeetingCard/MeetingResonded';
import { Stack } from 'src/components/common/Stack/Stack';
import { useCommunityManagementStore } from 'src/pages/admin-pages/admin-community/admin-community.provider.tsx';
import { CommunityMeeting } from 'src/transport/communities/communities.dto.ts';

type MeetingResondedProps = {
  onEditClick?: (meeting: CommunityMeeting) => void;
  handleInviteMembersClick?: (meeting: CommunityMeeting) => void;
  handleShareMeetingClick?: (meeting: CommunityMeeting) => void;
  canActionMeeting?: boolean;
  isMeetingsLoading?: boolean;
};

export const MeetingList = observer(
  ({
    onEditClick,
    handleInviteMembersClick,
    handleShareMeetingClick,
    isMeetingsLoading,
    canActionMeeting = true,
  }: MeetingResondedProps) => {
    const { communityId, meetings, community } = useCommunityManagementStore();
    return (
      <>
        {meetings?.length ? (
          <Stack vertical wrap={false}>
            {meetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                canActionMeeting={canActionMeeting}
                onEditClick={
                  onEditClick ? () => onEditClick(meeting) : undefined
                }
                handleInviteMembersClick={
                  handleInviteMembersClick
                    ? () => handleInviteMembersClick(meeting)
                    : undefined
                }
                handleShareMeetingClick={
                  handleShareMeetingClick
                    ? () => handleShareMeetingClick(meeting)
                    : undefined
                }
                communityId={communityId}
                communityAlias={community?.alias || ''}
              >
                <MeetingResonded meeting={meeting} />
              </MeetingCard>
            ))}
          </Stack>
        ) : (
          !isMeetingsLoading && <Empty />
        )}
      </>
    );
  }
);
