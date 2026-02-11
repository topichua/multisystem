import { ChevronDown } from '@untitled-ui/icons-react';
import { Dropdown, notification, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import { useMemo } from 'react';
import { meetingDrawerOptions } from 'src/components/common/MeetingCard/consts.tsx';
import * as S from 'src/components/common/MeetingCard/MeetingCard.styled.ts';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import {
  ExploreMeetStatus,
  MeetStatus,
} from 'src/transport/communities/communities.dto.ts';
import { dateRSVPMeetingFormat } from 'src/utils/date-time.ts';
import { Button } from '../Button/Button';
import dayjs from 'dayjs';
import { convertDurationToDate } from 'src/utils/time';

type MeetingStatusDropdownProps = {
  updateMeetingStatus: (
    communityId: string,
    meetId: string,
    status: string
  ) => Promise<void>;
  communityId: string;
} & (MeetStatus | ExploreMeetStatus);

const MeetingStatusDropdown = observer(
  ({
    meet,
    status,
    updateMeetingStatus,
    communityId,
  }: MeetingStatusDropdownProps) => {
    const selectedOption =
      meetingDrawerOptions.find((option) => option.key === status) ||
      meetingDrawerOptions[0];

    const handleSelect = (newStatus: string) => {
      updateMeetingStatus(communityId, meet.id, newStatus)
        .then(() => notification.success({ message: 'Successfully updated' }))
        .catch(() => notification.error({ message: 'Error during updating' }));
    };

    const { isRSVPDisabled, tooltipText, formattedRSVPDate } = useMemo(() => {
      const currentDate = dayjs();
      const meetingEndDate = convertDurationToDate(
        meet.duration,
        meet.startDate
      );

      let disabled = false;
      let tooltip = '';
      let formattedRSVPDate = '';

      if (currentDate.isAfter(meetingEndDate)) {
        disabled = true;
        tooltip = 'RSVP is closed. The meeting date and time have passed.';
      } else if (meet.rsvpDate && currentDate.isAfter(meet.rsvpDate)) {
        disabled = true;
        tooltip = 'RSVP is closed. The deadline has passed.';
      }

      if (meet.rsvpDate) {
        formattedRSVPDate = dayjs(meet.rsvpDate).format(dateRSVPMeetingFormat);
      }

      return {
        isRSVPDisabled: disabled,
        tooltipText: tooltip,
        formattedRSVPDate,
      };
    }, [meet]);

    return (
      <>
        {meet.rsvpDate && (
          <Stack alignment="center" style={{ marginBottom: 5 }}>
            <S.RsvpDate>RSVP by: {formattedRSVPDate}</S.RsvpDate>
          </Stack>
        )}
        <Dropdown
          menu={{
            items: meetingDrawerOptions.slice(1),
            onClick: (e) => handleSelect(e.key),
          }}
          trigger={['click']}
        >
          <Tooltip title={tooltipText}>
            <Button
              disabled={isRSVPDisabled}
              rightIcon={<ChevronDown height={16} />}
              style={{ gap: '0px' }}
            >
              {selectedOption?.label}
            </Button>
          </Tooltip>
        </Dropdown>
      </>
    );
  }
);

export default MeetingStatusDropdown;
