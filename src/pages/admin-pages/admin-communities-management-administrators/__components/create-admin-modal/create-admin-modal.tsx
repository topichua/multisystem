import { AutoComplete, Empty, Spin, Typography } from 'antd';
import { useBoolean } from 'ahooks';

import { Modal } from 'src/components/common/Modal/Modal';
import { Stack } from 'src/components/common/Stack/Stack';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';

import { useFindUsers } from './useFindUsers';
import { UserCommunitiesInfo } from './user-communities-info';
import { useEffect } from 'react';

const { Text } = Typography;

type CreateAdminModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSave: (email: string) => void;
};

export const CreateAdminModal = ({
  isOpen,
  isLoading = false,
  onClose,
  onSave,
}: CreateAdminModalProps) => {
  const {
    query,
    usersOptions,
    isLoading: isSearchUsersLoading,
    disabledContinue,
    selectedUser,
    onSelectUser,
    setQuery,
  } = useFindUsers();

  const [
    isConfirmModalOpen,
    { setTrue: openConfirmModal, setFalse: closeConfirmModal },
  ] = useBoolean(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      onSelectUser(null);
      closeConfirmModal();
    }
  }, [isOpen]);

  const handleCreateAdmin = () => {
    if (!selectedUser?.registeredEmail) return;

    onSave(selectedUser?.registeredEmail);
  };

  const renderDropdown = () => (
    <Stack distribution="center">
      <Spin spinning size="small" />
    </Stack>
  );

  return (
    <>
      <Modal
        title="Add manager"
        open={isOpen}
        okButtonProps={{ disabled: disabledContinue }}
        cancelButtonProps={{ disabled: isLoading }}
        okText="Add as manager"
        onOk={openConfirmModal}
        onCancel={onClose}
      >
        <Stack vertical>
          <AutoComplete
            placeholder="Type name or email"
            style={{ width: '100%' }}
            options={usersOptions}
            value={query}
            dropdownRender={isSearchUsersLoading ? renderDropdown : undefined}
            notFoundContent={
              query.trim().length > 2 ? (
                <Empty />
              ) : (
                <Text type="secondary">Please enter at least 3 letters</Text>
              )
            }
            onSearch={setQuery}
            onSelect={onSelectUser}
          />

          {selectedUser && <UserCommunitiesInfo user={selectedUser} />}
        </Stack>
      </Modal>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Confirmation"
        isLoading={isLoading}
        description={`You are about to assign ${selectedUser?.firstName} ${selectedUser?.lastName} as a manager for all communities. Please note, the user will lose all current roles and associations in the communities upon being assigned as a manager.

`}
        onClose={closeConfirmModal}
        onConfirm={handleCreateAdmin}
      />
    </>
  );
};
