import { Users01 } from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import dayjs from 'dayjs';
import { Button } from 'src/components/common/Button/Button.tsx';
import * as S from 'src/components/common/MeetingCard/MeetingCard.styled.ts';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import MeetingUsersModal from 'src/pages/admin-pages/admin-community/__components/meeting-users-modal/meeting-users-modal.tsx';
import { CommunityMeeting } from 'src/transport/communities/communities.dto.ts';
import { dateRSVPMeetingFormat } from 'src/utils/date-time.ts';

type MeetingResondedProps = {
  meeting: CommunityMeeting;
};

const MeetingResonded = ({ meeting }: MeetingResondedProps) => {
  const [
    isOpenMeetingUsersModal,
    { setTrue: openMeetingUsersModal, setFalse: closeMeetingUsersModal },
  ] = useBoolean(false);

  return (
    <>
      <Stack vertical style={{ marginBottom: 5 }}>
        {meeting.rsvpDate && (
          <S.RsvpDate>
            RSVP by: {dayjs(meeting.rsvpDate).format(dateRSVPMeetingFormat)}
          </S.RsvpDate>
        )}
      </Stack>
      <Button icon={<Users01 height={16} />} onClick={openMeetingUsersModal}>
        RSVP respondents
      </Button>
      <MeetingUsersModal
        isOpen={isOpenMeetingUsersModal}
        meeting={meeting}
        onClose={closeMeetingUsersModal}
      />
    </>
  );
};

export default MeetingResonded;
