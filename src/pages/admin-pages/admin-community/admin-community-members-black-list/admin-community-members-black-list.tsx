import {
  DotsVertical,
  Expand01,
  ImageUserX,
  Plus,
  UserPlus01,
} from '@untitled-ui/icons-react';
import { useBoolean, useDebounce, useMount } from 'ahooks';
import { observer } from 'mobx-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Card } from 'src/components/common/Card/Card';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { SearchBar } from 'src/components/common/Searchbar/Searchbar';
import { Stack } from 'src/components/common/Stack/Stack';
import { Tag } from 'src/components/common/Tag/Tag';
import { Title } from 'src/components/common/Typography/Title';
import { Page } from 'src/components/common/page/page';

import { Dropdown, notification, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Button } from 'src/components/common/Button/Button';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';
import ReasonModal, {
  ReasonToUpdate,
} from 'src/pages/admin-pages/admin-community/admin-community-members-black-list/ReasonModal.tsx';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
import { CommunityMember } from 'src/transport/communities/communities.dto';
import { getCalendarDateTime } from 'src/utils/date-time';
import { isUserAdmin } from 'src/utils/post/user';
import { BanMembersModal } from '../__components/ban-members-modal/ban-members-modal';
import {
  COLUMN_ACTIONS_KEY,
  COLUMN_REMOVED_STATUS,
  COLUMN_ROLE_KEY,
  COLUMN_STATUS_KEY,
  MembersTable,
} from '../__components/members-table/members-table';
import { useCommunityManagementStore } from '../admin-community.provider';
import { formatMemberText } from 'src/utils/text';
import Paragraph from 'antd/es/typography/Paragraph';

const { Text } = Typography;

export const AdminCommunityMembersBlackList = observer(() => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, { wait: 500 });
  const [selectedMemberToUnban, setSelectedMemberToUnban] =
    useState<CommunityMember | null>(null);

  const [reasonToUpdate, setReasonToUpdate] = useState<ReasonToUpdate | null>(
    null
  );

  const {
    isBannedMembersLoading,
    communityId,
    bannedMembersCount,
    bannedMembers,
    isBanMembersLoading,
    permissions,
    loadBannedMembers,
    banMembers,
    unBlockUser,
    isUnBlockUserLoading,
  } = useCommunityManagementStore();

  const { user, globalPermission } = useCurrentUserStore();

  const [
    isBanMembersModalOpen,
    { setFalse: closeBanMembersModal, setTrue: openBanMembersModal },
  ] = useBoolean(false);

  useMount(() => {
    loadBannedMembers();
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const banUsers = useCallback(
    async (usersIds: string[], reason: string) => {
      try {
        await banMembers(usersIds, reason);
        loadBannedMembers();
        closeBanMembersModal();
      } catch (e) {
        notification.error({ message: `Failed to ban members: ${e}` });
      }
    },
    [banMembers, closeBanMembersModal, loadBannedMembers]
  );

  const editMemberStatus = useCallback(() => {
    unBlockUser(communityId, [selectedMemberToUnban?.userId] as string[])
      .then(() => {
        setSelectedMemberToUnban(null);
        loadBannedMembers();
      })
      .catch((e) => {
        notification.error({ message: `Error updating member role:, ${e}` });
      });
  }, [
    communityId,
    loadBannedMembers,
    selectedMemberToUnban?.userId,
    unBlockUser,
  ]);

  const isAdmin = isUserAdmin(user);

  const canManageBlacklist =
    permissions?.communityBlacklist || globalPermission?.communityBlacklist;

  const getColumns = useCallback(
    (columns: ColumnsType<CommunityMember>): ColumnsType<CommunityMember> => [
      ...(columns?.filter(
        (column) =>
          ![
            COLUMN_STATUS_KEY,
            COLUMN_ACTIONS_KEY,
            COLUMN_ROLE_KEY,
            COLUMN_REMOVED_STATUS,
          ].includes((column?.key as string) || '')
      ) || []),
      {
        title: 'Blacklisted On',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 150,
        render(value) {
          return <Text>{getCalendarDateTime(value)}</Text>;
        },
      },
      {
        title: 'Reason',
        dataIndex: 'reason',
        key: 'reason',
        width: 300,
        render: (_, member) => (
          <Stack wrap={false} distribution="equalSpacing" alignment="center">
            <Paragraph
              ellipsis={{ rows: 2, expandable: false }}
              style={{ margin: 0 }}
            >
              {member?.reason}
            </Paragraph>
            <Stack vertical spacing="extraTight">
              <Expand01
                width={15}
                height={15}
                color="gray"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  setReasonToUpdate({
                    reason: member?.reason || '',
                    userId: member.userId || '',
                  })
                }
              />
            </Stack>
          </Stack>
        ),
      },
      {
        title: '',
        key: COLUMN_ACTIONS_KEY,
        fixed: 'right',
        hidden: !canManageBlacklist,
        width: 50,
        render: (_, member) => (
          <Stack distribution="center">
            <Dropdown
              menu={{
                items: [
                  {
                    key: '1',
                    label: 'Remove from blacklist',
                    icon: <UserPlus01 width={16} height={16} />,
                    onClick: () => setSelectedMemberToUnban(member),
                  },
                ],
              }}
            >
              <Button type="text" icon={<DotsVertical />} />
            </Dropdown>
          </Stack>
        ),
      },
    ],
    [isAdmin, canManageBlacklist]
  );

  const filteredMembers = useMemo(() => {
    const normalizeSearch = debouncedSearch.toLowerCase();

    return bannedMembers?.filter(
      (member) =>
        member.firstName?.toLowerCase().includes(normalizeSearch) ||
        member.lastName?.toLowerCase().includes(normalizeSearch) ||
        member.email?.toLowerCase().includes(normalizeSearch)
    );
  }, [debouncedSearch, bannedMembers]);

  return (
    <Stack vertical>
      <FixedContentHeader>
        <InnerPageHeader title="Blacklist" icon={<ImageUserX />}>
          {canManageBlacklist && (
            <Stack distribution="trailing">
              <Button
                type="primary"
                icon={<Plus />}
                onClick={openBanMembersModal}
              >
                Blacklist user
              </Button>
            </Stack>
          )}
        </InnerPageHeader>
      </FixedContentHeader>

      <Page.Content>
        <Card>
          <Stack vertical spacing="loose">
            <Stack alignment="center">
              <Stack.Item>
                <Title level={4}>All users</Title>
              </Stack.Item>

              <Stack.Item>
                <Tag size="small">
                  {formatMemberText(
                    bannedMembersCount || 0,
                    'blacklisted',
                    'user'
                  )}
                </Tag>
              </Stack.Item>
            </Stack>

            <Stack.Item>
              <div style={{ maxWidth: 650 }}>
                <SearchBar
                  placeholder="Start typing"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </Stack.Item>

            <Stack.Item>
              <MembersTable
                members={filteredMembers || []}
                isLoading={isBannedMembersLoading}
                currentPage={page}
                canMemberAction={() => isAdmin}
                onChangeCurrentPage={setPage}
                columns={getColumns}
              />
            </Stack.Item>
          </Stack>
        </Card>
      </Page.Content>

      <BanMembersModal
        isOpen={isBanMembersModalOpen}
        communityId={communityId}
        isLoading={isBanMembersLoading}
        onClose={closeBanMembersModal}
        onAddUser={banUsers}
      />

      <ConfirmModal
        isOpen={!!selectedMemberToUnban}
        isLoading={isUnBlockUserLoading}
        confirmButtonText="Remove from blacklist"
        title="Remove from blacklist"
        description={`Are you sure you want to remove from blacklist: ${selectedMemberToUnban?.firstName || ''} ${selectedMemberToUnban?.lastName || ''}`}
        onClose={() => setSelectedMemberToUnban(null)}
        onConfirm={editMemberStatus}
      />
      {reasonToUpdate && (
        <ReasonModal
          isOpen={!!reasonToUpdate}
          onClose={() => setReasonToUpdate(null)}
          initReason={reasonToUpdate}
        />
      )}
    </Stack>
  );
});
