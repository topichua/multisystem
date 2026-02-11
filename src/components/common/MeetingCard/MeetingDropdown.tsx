import {
  DotsHorizontal,
  Edit05,
  Share06,
  Trash01,
  UserPlus02,
} from '@untitled-ui/icons-react';
import { Button, Dropdown, MenuProps, notification } from 'antd';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { MEETING_VISIBILITY } from 'src/pages/admin-pages/admin-community/__components/share_meeting_modal/const.tsx';
import { useCommunityManagementStore } from 'src/pages/admin-pages/admin-community/admin-community.provider';
import {
  CommunityMeeting,
  ExploreMeet,
} from 'src/transport/communities/communities.dto.ts';

type MeetingPopoverProps = {
  meeting: CommunityMeeting | ExploreMeet;
  canActionMeeting?: boolean;
  onEditClick: () => void;
  handleInviteMembersClick: () => void;
  handleShareMeetingClick: () => void;
};

export const MeetingDropdown = observer(
  ({
    meeting,
    canActionMeeting = true,
    onEditClick,
    handleInviteMembersClick,
    handleShareMeetingClick,
  }: MeetingPopoverProps) => {
    const { removeMeeting } = useCommunityManagementStore();

    const [isOpen, setIsOpen] = useState(false);
    const [isRemoveMeetingLoading, setRemoveMeetingLoading] = useState(false);

    const handleEditClick = () => {
      onEditClick();
      setIsOpen(false);
    };

    const handleShareClick = () => {
      handleShareMeetingClick();
      setIsOpen(false);
    };

    const handleInviteClick = () => {
      handleInviteMembersClick();
      setIsOpen(false);
    };

    const handleDeleteClick = () => {
      setRemoveMeetingLoading(true);
      removeMeeting(meeting.id)
        .then(() => {
          setIsOpen(false);
          notification.success({ message: `Removed successfully!` });
        })
        .catch((e) => {
          notification.error({ message: `Error removing meeting:, ${e}` });
        })
        .finally(() => {
          setIsOpen(false);
          setRemoveMeetingLoading(false);
        });
    };

    const menuContent: MenuProps['items'] = [
      ...(canActionMeeting
        ? [
            {
              key: 1,
              label: 'Edit details',
              icon: <Edit05 height={20} />,
              onClick: handleEditClick,
            },
          ]
        : []),

      {
        key: 2,
        label: 'Share meeting',
        icon: <Share06 height={20} />,
        onClick: handleShareClick,
      },
      ...(meeting.visible === MEETING_VISIBILITY.PRIVATE
        ? [
            {
              key: 3,
              label: 'Invite members',
              icon: <UserPlus02 height={20} />,
              onClick: handleInviteClick,
            },
          ]
        : []),

      ...(canActionMeeting
        ? [
            {
              key: 4,
              label: 'Delete meeting',
              icon: <Trash01 height={20} />,
              onClick: handleDeleteClick,
              danger: true,
            },
          ]
        : []),
    ];

    return (
      <Dropdown
        open={isOpen}
        onOpenChange={(visible) => {
          setIsOpen(visible);
        }}
        menu={{ items: menuContent }}
        trigger={['click']}
        placement="bottomRight"
        overlayStyle={{ width: 240 }}
      >
        <Button type="link" loading={isRemoveMeetingLoading}>
          <DotsHorizontal />
        </Button>
      </Dropdown>
    );
  }
);
