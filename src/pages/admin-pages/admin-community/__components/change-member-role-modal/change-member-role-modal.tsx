import { Select, Typography } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useMemo, useState } from 'react';

import { Modal } from 'src/components/common/Modal/Modal';
import { Stack } from 'src/components/common/Stack/Stack';
import {
  CommunityMember,
  CommunityRole,
} from 'src/transport/communities/communities.dto';
import { useCommunityManagementStore } from '../../admin-community.provider';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';

const { Text } = Typography;

type ChangeMemberRoleModalProps = {
  isOpen: boolean;
  member: CommunityMember | null;
  isLoading?: boolean;
  onClose: () => void;
  onSave: (role: CommunityRole) => void;
};

export const ChangeMemberRoleModal = observer(
  ({
    isOpen,
    member,
    isLoading = false,
    onClose,
    onSave,
  }: ChangeMemberRoleModalProps) => {
    const [role, setRole] = useState<CommunityRole | null>(null);

    const { permissions } = useCommunityManagementStore();

    const { globalPermission } = useCurrentUserStore();

    useEffect(() => {
      if (member) {
        setRole(member.role);
      }
    }, [member]);

    const options = useMemo(() => {
      const selectOptions = [
        { value: CommunityRole.Member, label: 'Member' },
        { value: CommunityRole.Editor, label: 'Editor' },

        ...(permissions?.communityAddModerator ||
        globalPermission?.communityAddModerator
          ? [{ value: CommunityRole.CommunityMoModerator, label: 'Moderator' }]
          : []),
      ];

      return selectOptions;
    }, [permissions, globalPermission]);

    return (
      <Modal
        open={isOpen}
        title="Change member role"
        destroyOnClose
        okButtonProps={{ disabled: member?.role === role, loading: isLoading }}
        cancelButtonProps={{ disabled: isLoading }}
        onCancel={onClose}
        onOk={() => onSave(role as CommunityRole)}
      >
        <Stack vertical distribution="leading" spacing="loose">
          <Text>Please choose new member role from the list below</Text>

          <Select
            value={role}
            style={{ width: '100%', marginBottom: 10 }}
            onChange={setRole}
            options={options}
          />
        </Stack>
      </Modal>
    );
  }
);
