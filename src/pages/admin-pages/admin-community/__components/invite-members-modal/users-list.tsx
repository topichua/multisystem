import { Checkbox, CheckboxProps, Typography } from 'antd';
import noop from 'lodash/noop';
import { FC } from 'react';

import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { CommunityMember } from 'src/transport/communities/communities.dto.ts';
import * as S from '../share_meeting_modal/ShareMeetingModal.styled.ts';

const { Text } = Typography;

type UsersListProps = {
  users: CommunityMember[];
  selectedUsersIds: string[];
  initUsersIds: string[];
  toggleUserId: (id: string) => void;
  checkboxProps?: (user: CommunityMember) => CheckboxProps;
};

export const UsersList: FC<UsersListProps> = ({
  users,
  toggleUserId,
  initUsersIds,
  selectedUsersIds,
  checkboxProps = noop,
}) => (
  <Stack vertical>
    {users.length && <Text>Suggested</Text>}
    {users.map((user, index) => {
      const userId = user.userId || '';

      return (
        <Stack key={index} alignment="center">
          <S.StyledAvatar
            isInvited={initUsersIds.includes(userId)}
            firstName={user.firstName || ''}
            lastName={user.lastName || ''}
          />
          <Stack.Item fill>
            <Stack alignment="center">
              <Stack vertical spacing="none">
                <Text
                  type={initUsersIds.includes(userId) ? 'secondary' : undefined}
                >
                  {user.firstName} {user.lastName}
                </Text>
              </Stack>
              {initUsersIds.includes(userId) && (
                <Text strong>Already invited </Text>
              )}
            </Stack>
          </Stack.Item>
          <Checkbox
            checked={
              selectedUsersIds.includes(userId) || initUsersIds.includes(userId)
            }
            disabled={initUsersIds.includes(userId)}
            onChange={() => toggleUserId(userId)}
            {...(checkboxProps(user) ?? {})}
          />
        </Stack>
      );
    })}
  </Stack>
);
