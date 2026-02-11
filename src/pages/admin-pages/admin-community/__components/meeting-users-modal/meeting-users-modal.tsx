import { Empty, Typography } from 'antd';
import { useMemo } from 'react';
import { Divider } from 'src/components/common/Divider/Divider';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { Tag } from 'src/components/common/Tag/Tag.tsx';
import MeetingUser from 'src/pages/admin-pages/admin-community/__components/meeting-users-modal/meeting-user.tsx';
import { useGetUsersByIds } from 'src/pages/community-pages/communities-home-feed/__hooks/useGetUsersByIds.ts';
import { CommunityMeeting } from 'src/transport/communities/communities.dto';
import {
  getGroupedUsersByStatus,
  getStatusTitle,
  meetingStatusValues,
} from './consts';
import * as S from './meeting-users-modal.styled';

const { Text } = Typography;

type MeetingUsersModalProps = {
  isOpen: boolean;
  meeting: CommunityMeeting;
  onClose: () => void;
};

export const MeetingUsersModal = ({
  isOpen,
  meeting,
  onClose,
}: MeetingUsersModalProps) => {
  const { users: meetingMembers } = meeting;

  const usersIds = useMemo(() => {
    return meetingMembers.map((user) => user.userId);
  }, [meetingMembers]);

  const { users, isLoading } = useGetUsersByIds(usersIds);
  const groupedUsersByStatus = useMemo(
    () => getGroupedUsersByStatus(meetingMembers),
    [meetingMembers]
  );

  const items = useMemo(() => {
    return meetingStatusValues.map((meetingStatus) => {
      const usersByStatus = groupedUsersByStatus[meetingStatus];
      return {
        key: meetingStatus.toString(),
        label: (
          <Stack spacing="extraTight">
            <Text>{getStatusTitle[meetingStatus]}</Text>
            <Tag size="small">{usersByStatus?.length || 0}</Tag>
          </Stack>
        ),
        children: (
          <Stack vertical>
            {usersByStatus?.length ? (
              usersByStatus?.map((userId) => (
                <MeetingUser key={userId} user={users[userId]} />
              ))
            ) : (
              <Empty description="No users in category" />
            )}
          </Stack>
        ),
      };
    });
  }, [groupedUsersByStatus, users]);

  return (
    <S.StyledModal
      title="Meeting responses"
      centered
      open={isOpen}
      onCancel={onClose}
      footer={null}
      loading={isLoading}
    >
      <Divider spacing="tight" />
      <S.StyledTabs defaultActiveKey={items[0].key} items={items} />
    </S.StyledModal>
  );
};

export default MeetingUsersModal;
