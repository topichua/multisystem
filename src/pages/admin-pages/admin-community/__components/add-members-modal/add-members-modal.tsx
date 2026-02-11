import { Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';

import { Button } from 'src/components/common/Button/Button';
import { Divider } from 'src/components/common/Divider/Divider';
import { SearchBar } from 'src/components/common/Searchbar/Searchbar';
import { Stack } from 'src/components/common/Stack/Stack';
import { useCommunityUsers } from 'src/hooks/useSearchUsers.ts';

import { EmptyUserList } from './__components/empty-components';
import { UsersList } from './__components/users-list';
import * as S from './add-members-modal.styled';

const { Text } = Typography;

export type AddMembersModalProps = {
  communityId: string;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onAddUser: (usersIds: string[]) => void;
};

export const AddMembersModal = ({
  isOpen,
  communityId,
  isLoading = false,
  onClose,
  onAddUser,
}: AddMembersModalProps) => {
  const [selectedUsersIds, setSelectedUsersIds] = useState<string[]>([]);

  const {
    users,
    isLoading: isUsersLoading,
    keyword,
    setKeyword,
    ref,
  } = useCommunityUsers(communityId);

  useEffect(() => {
    if (!isOpen) {
      setKeyword('');
      setSelectedUsersIds([]);
    }
  }, [isOpen]);

  const toggleUserId = (id: string) => {
    const findIndex = selectedUsersIds.findIndex((item) => item === id);
    if (findIndex === -1) {
      setSelectedUsersIds([...selectedUsersIds, id]);
    } else {
      const copiedIds = [...selectedUsersIds];
      copiedIds.splice(findIndex, 1);
      setSelectedUsersIds(copiedIds);
    }
  };

  return (
    <S.Modal
      open={isOpen}
      title="Add members"
      footer={
        <Stack alignment="center">
          <Stack.Item fill>
            <Text strong>Users to add: {selectedUsersIds.length}</Text>
          </Stack.Item>

          <Stack.Item>
            <Stack alignment="center">
              <Button onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="primary"
                disabled={selectedUsersIds.length === 0}
                loading={isLoading}
                onClick={() => onAddUser(selectedUsersIds)}
              >
                Add
              </Button>
            </Stack>
          </Stack.Item>
        </Stack>
      }
      onCancel={onClose}
    >
      <Divider />

      <Stack vertical>
        <SearchBar
          value={keyword}
          placeholder="Search by name or email"
          onChange={(e) => setKeyword(e.target.value)}
        />

        <Spin spinning={isUsersLoading}>
          <S.ListWrapper
            ref={ref}
            alignCenter={users.length === 0 || keyword.length < 3}
          >
            <UsersList
              users={users}
              toggleUserId={toggleUserId}
              selectedUsersIds={selectedUsersIds}
              tooltipTitle={(member) => {
                if (member.isInCommunity)
                  return 'User is already in your community';
                if (member.isBlocked)
                  return 'To add this user as a member, remove them from the blacklist first';

                return '';
              }}
              checkboxProps={(member) => ({
                disabled: member.isInCommunity || member.isBlocked,
              })}
            />

            {!isUsersLoading && users.length === 0 && keyword.length < 2 && (
              <EmptyUserList keyword={keyword} usersCount={users.length} />
            )}
          </S.ListWrapper>
        </Spin>
      </Stack>
    </S.Modal>
  );
};
