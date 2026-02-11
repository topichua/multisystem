import {
  DotsVertical,
  ImageUserRight,
  UserLeft01,
} from '@untitled-ui/icons-react';
import { useDebounce, useMount } from 'ahooks';
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
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
import { CommunityMember } from 'src/transport/communities/communities.dto';
import { getCalendarDateTime } from 'src/utils/date-time';
import { isUserAdmin } from 'src/utils/post/user';
import {
  COLUMN_ACTIONS_KEY,
  COLUMN_REMOVED_STATUS,
  COLUMN_ROLE_KEY,
  COLUMN_STATUS_KEY,
  MembersTable,
} from '../__components/members-table/members-table';
import { useCommunityManagementStore } from '../admin-community.provider';
import { formatMemberText } from 'src/utils/text';

const { Text } = Typography;

export const AdminCommunityRemovedMembers = observer(() => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, { wait: 500 });
  const [selectedMemberToUnDelete, setSelectedMemberToUnDelete] =
    useState<CommunityMember | null>(null);

  const {
    isDeletedMembersLoading,
    deletedMembersCount,
    deletedMembers,
    permissions,
    loadDeletedMembers,
    unDeleteUser,
    isUnDeleteLoading,
  } = useCommunityManagementStore();

  const { user, globalPermission } = useCurrentUserStore();

  useMount(() => {
    loadDeletedMembers();
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const editMemberStatus = useCallback(() => {
    unDeleteUser(selectedMemberToUnDelete?.userId as string)
      .then(() => {
        setSelectedMemberToUnDelete(null);
        loadDeletedMembers();
      })
      .catch((e) => {
        notification.error({ message: `Error updating member role:, ${e}` });
      });
  }, [loadDeletedMembers, selectedMemberToUnDelete?.userId, unDeleteUser]);

  const isAdmin = isUserAdmin(user);

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
        title: 'Exit date',
        dataIndex: 'updatedAt',
        key: 'edit_date',
        width: 300,
        render(value) {
          return <Text>{getCalendarDateTime(value) || '-'}</Text>;
        },
      },
      {
        title: '',
        key: COLUMN_ACTIONS_KEY,
        hidden:
          !permissions?.communityAddMember &&
          !globalPermission?.communityAddMember,
        width: 50,
        render: (_, member) => {
          return (
            <Stack distribution="center">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: '1',
                      label: 'Return to community',
                      icon: <UserLeft01 width={16} height={16} />,
                      onClick: () => setSelectedMemberToUnDelete(member),
                    },
                  ],
                }}
              >
                <Button type="text" icon={<DotsVertical />} />
              </Dropdown>
            </Stack>
          );
        },
      },
    ],
    [permissions, globalPermission]
  );

  const filteredMembers = useMemo(() => {
    const normalizeSearch = debouncedSearch.toLowerCase();

    return deletedMembers?.filter(
      (member) =>
        member.firstName?.toLowerCase().includes(normalizeSearch) ||
        member.lastName?.toLowerCase().includes(normalizeSearch) ||
        member.email?.toLowerCase().includes(normalizeSearch)
    );
  }, [debouncedSearch, deletedMembers]);

  return (
    <Stack vertical>
      <FixedContentHeader>
        <InnerPageHeader title="Removed members" icon={<ImageUserRight />} />
      </FixedContentHeader>

      <Page.Content>
        <Card>
          <Stack vertical spacing="loose">
            <Stack alignment="center">
              <Stack.Item>
                <Title level={4}>All removed members</Title>
              </Stack.Item>

              <Stack.Item>
                <Tag size="small">
                  {formatMemberText(deletedMembersCount || 0, 'removed')}
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
                isLoading={isDeletedMembersLoading}
                currentPage={page}
                canMemberAction={() => isAdmin}
                onChangeCurrentPage={setPage}
                columns={getColumns}
              />
            </Stack.Item>
          </Stack>
        </Card>
      </Page.Content>

      <ConfirmModal
        isOpen={!!selectedMemberToUnDelete}
        isLoading={isUnDeleteLoading}
        confirmButtonText="Return to community"
        title="Return to community"
        description={`Are you sure you want to return to community: ${selectedMemberToUnDelete?.firstName || ''} ${selectedMemberToUnDelete?.lastName || ''}`}
        onClose={() => setSelectedMemberToUnDelete(null)}
        onConfirm={editMemberStatus}
      />
    </Stack>
  );
});
