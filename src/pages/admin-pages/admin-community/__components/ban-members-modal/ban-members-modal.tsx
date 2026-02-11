import { Spin, Typography } from 'antd';
import { FC, useCallback, useState } from 'react';

import { Button } from 'src/components/common/Button/Button';
import { Divider } from 'src/components/common/Divider/Divider';
import { SearchBar } from 'src/components/common/Searchbar/Searchbar';
import { Stack } from 'src/components/common/Stack/Stack';
import { useCommunityUsers } from 'src/hooks/useSearchUsers.ts';

import { EmptyUserList } from '../add-members-modal/__components/empty-components';
import { UsersList } from '../add-members-modal/__components/users-list';

import * as S from '../add-members-modal/add-members-modal.styled';
import { Input } from 'antd';

const { TextArea } = Input;
const { Text } = Typography;

export type BanMembersModalProps = {
  communityId: string;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onAddUser: (usersIds: string[], reason: string) => void;
};

export const BanMembersModal: FC<BanMembersModalProps> = ({
  isOpen,
  communityId,
  isLoading = false,
  onClose,
  onAddUser,
}) => {
  const [selectedUsersIds, setSelectedUsersIds] = useState<string[]>([]);
  const [reason, setReason] = useState<string>('');

  const {
    users,
    isLoading: isUsersLoading,
    keyword,
    setKeyword,
    ref,
  } = useCommunityUsers(communityId);

  const toggleUserId = useCallback(
    (id: string) =>
      setSelectedUsersIds((prevIds) =>
        prevIds.includes(id)
          ? prevIds.filter((item) => item !== id)
          : [...prevIds, id]
      ),
    []
  );

  const handleClose = useCallback(() => {
    setKeyword('');
    setReason('');
    setSelectedUsersIds([]);
    onClose();
  }, [onClose, setKeyword]);

  return (
    <S.Modal
      open={isOpen}
      title="Blacklist user"
      footer={
        <Stack alignment="center">
          <Stack.Item fill>
            <Text strong>Users to blacklist: {selectedUsersIds.length}</Text>
          </Stack.Item>

          <Stack.Item>
            <Stack alignment="center">
              <Button onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="primary"
                disabled={selectedUsersIds.length === 0 || !reason}
                loading={isLoading}
                onClick={() => {
                  onAddUser(selectedUsersIds, reason);
                  handleClose();
                }}
              >
                Add to blacklist
              </Button>
            </Stack>
          </Stack.Item>
        </Stack>
      }
      onCancel={handleClose}
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
              tooltipTitle={(user) =>
                (user?.isBlocked && 'User is already blacklisted') || ''
              }
              checkboxProps={(user) => ({
                disabled: user?.isBlocked,
                checked: selectedUsersIds.includes(user.id) || user?.isBlocked,
                onChange: () => toggleUserId(user.id),
              })}
            />

            {!isUsersLoading && users.length === 0 && keyword.length < 2 && (
              <EmptyUserList keyword={keyword} usersCount={users.length} />
            )}
          </S.ListWrapper>
        </Spin>
        <Text strong>Reason</Text>
        <TextArea
          value={reason}
          placeholder="Enter a reason"
          onChange={(e) => setReason(e.target.value)}
          autoSize={{ minRows: 3, maxRows: 3 }}
        />
      </Stack>
    </S.Modal>
  );
};
