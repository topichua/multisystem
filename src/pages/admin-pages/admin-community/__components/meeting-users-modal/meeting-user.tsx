import { Typography } from 'antd';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { UserAvatar } from 'src/components/common/user-avatar/User-avatar.tsx';
import { UserProfileDto } from 'src/transport/account/account.dto.ts';

const { Text } = Typography;

type MeetingUserProps = {
  user: UserProfileDto;
};

const MeetingUser = ({ user }: MeetingUserProps) => {
  return (
    <Stack alignment="center">
      <UserAvatar
        src={user?.avatarUrl}
        size={40}
        firstName={user?.firstName || ''}
        lastName={user?.lastName || ''}
      />
      <Stack vertical spacing="none">
        <Text strong>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text type="secondary">{user?.registeredEmail}</Text>
      </Stack>
    </Stack>
  );
};

export default MeetingUser;
