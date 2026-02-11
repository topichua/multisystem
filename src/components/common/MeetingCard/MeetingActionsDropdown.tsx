import { DotsHorizontal, Share06 } from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import { Button, Dropdown } from 'antd';
import { FC } from 'react';
import SaveToCalendar from 'src/components/common/SaveToCalendar/save-to-calendar.tsx';
import {
  CommunityMeeting,
  ExploreMeet,
} from 'src/transport/communities/communities.dto.ts';
import { UseCopyMeetingUrlResult } from './hooks/useCopyMeetingUrl';

type ShareMeetingDropdownProps = UseCopyMeetingUrlResult & {
  meeting: CommunityMeeting | ExploreMeet;
};
export const MeetingActionsDropdown: FC<ShareMeetingDropdownProps> = ({
  handleCopy,
  meeting,
}) => {
  const [isOpenDropdown, { setFalse: closeDropdown, toggle: toggleDropdown }] =
    useBoolean(false);

  return (
    <Dropdown
      open={isOpenDropdown}
      menu={{
        items: [
          {
            label: 'Share meeting',
            key: '1',
            onClick: () => handleCopy().then(closeDropdown),
            icon: <Share06 height={20} width={20} />,
          },
          {
            label: (
              <SaveToCalendar meeting={meeting} handleClick={closeDropdown} />
            ),
            key: '2',
          },
        ],
        onMouseLeave: closeDropdown,
      }}
    >
      <Button
        type="link"
        icon={<DotsHorizontal />}
        onClick={toggleDropdown}
        style={{ padding: 0 }}
      />
    </Dropdown>
  );
};
