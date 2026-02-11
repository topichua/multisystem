import {
  CalendarCheck01,
  ChevronDown,
  ChevronUp,
  ClockRewind,
  LayoutGrid01,
} from '@untitled-ui/icons-react';
import { Spin } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { observer } from 'mobx-react';
import { ReactNode, useCallback, useMemo } from 'react';
import { Divider } from 'src/components/common/Divider/Divider.tsx';
import { getStatusTitle } from 'src/pages/admin-pages/admin-community/__components/meeting-users-modal/consts.ts';
import { useExploreMeetingsStore } from 'src/pages/explore-meetings/explore-meetings.provider.tsx';
import { MeetingType } from 'src/store/explore-meetings/explore-meetings-store.tsx';
import { MeetingStatus } from 'src/transport/communities/communities.dto.ts';
import * as S from './common.styled.ts';
import CommunitiesMenu from './CommunitiesMenu.tsx';

const meetingTypeIcons: Record<MeetingType, ReactNode> = {
  [MeetingType.All]: <LayoutGrid01 />,
  [MeetingType.YourUpcomingMeetings]: <CalendarCheck01 />,
  [MeetingType.PastMeetings]: <ClockRewind />,
};

export const ExploreMeetingsMenu = observer(() => {
  const {
    isCommunityLoading,
    selectedMeetingType,
    setSelectedMeetingType,
    setSelectedMeetingStatuses,
    selectedMeetingStatuses,
  } = useExploreMeetingsStore();

  const onCheckboxChange = useCallback(
    (status: MeetingStatus, checked: boolean) => {
      setSelectedMeetingStatuses(
        checked
          ? [...selectedMeetingStatuses, status]
          : selectedMeetingStatuses.filter((c) => c !== status)
      );
    },
    [selectedMeetingStatuses, setSelectedMeetingStatuses]
  );

  const menuItemsMeetings = useMemo(() => {
    const items: Array<ItemType> = [
      {
        key: 'Meetings',
        label: 'Meetings',
        children: Object.values(MeetingType).map((meetingType) => ({
          key: meetingType,
          label: meetingType,
          icon: meetingTypeIcons[meetingType],
          onClick: () => setSelectedMeetingType(meetingType),
        })),
      },
      {
        key: ' ',
        label: ' ',
        icon: <Divider />,
      },
      {
        key: 'Meeting status',
        label: 'Meeting status',
        children: Object.keys(MeetingStatus)
          .slice(0, 3)
          .map((meetingStatus) => {
            const status = meetingStatus as unknown as MeetingStatus;
            const isChecked = selectedMeetingStatuses.includes(status);
            return {
              key: meetingStatus,
              label: getStatusTitle[status],
              icon: (
                <S.StyledCheckbox
                  key={meetingStatus}
                  checked={isChecked}
                  onChange={(e) => onCheckboxChange(status, e.target.checked)}
                />
              ),
              onClick: () => onCheckboxChange(status, !isChecked),
            };
          }),
      },
    ];

    return items;
  }, [onCheckboxChange, selectedMeetingStatuses, setSelectedMeetingType]);
  return (
    <>
      <Spin spinning={isCommunityLoading}>
        <CommunitiesMenu />
        <Divider />
      </Spin>
      <S.StyledMenu
        mode="inline"
        selectedKeys={selectedMeetingType ? [selectedMeetingType] : []}
        items={menuItemsMeetings}
        defaultOpenKeys={['Meetings', 'Meeting status']}
        expandIcon={({ isOpen }) => (isOpen ? <ChevronUp /> : <ChevronDown />)}
      />
    </>
  );
});
