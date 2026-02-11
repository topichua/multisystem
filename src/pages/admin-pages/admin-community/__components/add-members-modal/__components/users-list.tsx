import { Checkbox, CheckboxProps, Tooltip, Typography } from 'antd';
import noop from 'lodash/noop';
import { FC, ReactNode } from 'react';

import { Stack } from 'src/components/common/Stack/Stack';
import { Tag } from 'src/components/common/Tag/Tag';
import { UserAvatar } from 'src/components/common/user-avatar/User-avatar';
import { CommunityMember } from 'src/transport/user/user.dto';

const { Text } = Typography;

type UsersListProps = {
  users: CommunityMember[];
  selectedUsersIds: string[];
  toggleUserId: (id: string) => void;
  tooltipTitle?: (user: CommunityMember) => ReactNode;
  checkboxProps?: (user: CommunityMember) => CheckboxProps;
};

export const UsersList: FC<UsersListProps> = ({
  users,
  toggleUserId,
  selectedUsersIds,
  tooltipTitle = noop,
  checkboxProps = noop,
}) => {
  return (
    <Stack vertical>
      {users.map((user, index) => (
        <Stack key={index} alignment="center">
          <UserAvatar
            firstName={user.firstName || ''}
            lastName={user.lastName || ''}
            src={user.avatarSrc}
          />
          <Stack.Item fill>
            <Stack vertical spacing="none">
              <Stack alignment="center" spacing="tight">
                <Text strong>
                  {user.firstName} {user.lastName}
                </Text>

                {user.isBlocked && (
                  <Tag color="error" size="small">
                    Blacklisted
                  </Tag>
                )}
              </Stack>
              <Text type="secondary">{user.registeredEmail}</Text>
            </Stack>
          </Stack.Item>
          <Tooltip
            title={
              tooltipTitle(user) ??
              (user.isInCommunity ? 'User is already in your community' : '')
            }
          >
            <Checkbox
              checked={selectedUsersIds.includes(user.id) || user.isInCommunity}
              disabled={user.isInCommunity}
              onChange={() => toggleUserId(user.id)}
              {...(checkboxProps(user) ?? {})}
            />
          </Tooltip>
        </Stack>
      ))}
    </Stack>
  );
};
