import { useCallback, useEffect, useMemo, useState } from 'react';
import { ImageUserCheck, Plus } from '@untitled-ui/icons-react';
import { observer } from 'mobx-react';
import { useBoolean, useDebounce, useMount } from 'ahooks';

import { Card } from 'src/components/common/Card/Card';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { SearchBar } from 'src/components/common/Searchbar/Searchbar';
import { Stack } from 'src/components/common/Stack/Stack';
import { Tag } from 'src/components/common/Tag/Tag';
import { Title } from 'src/components/common/Typography/Title';
import { Page } from 'src/components/common/page/page';

import { useCommunityManagementStore } from '../admin-community.provider';
import { MembersTable } from '../__components/members-table/members-table';
import { Button } from 'src/components/common/Button/Button';
import { AddMembersModal } from '../__components/add-members-modal/add-members-modal';
import { notification } from 'antd';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
import { formatMemberText } from 'src/utils/text';
import {
  CommunityMember,
  CommunityRole,
} from 'src/transport/communities/communities.dto';

export const AdminCommunityMembers = observer(() => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, { wait: 500 });

  const {
    isMembersLoading,
    communityId,
    membersCount,
    members,
    isAddMembersLoading,
    permissions,
    loadMembers,
    addMembersToCommunity,
  } = useCommunityManagementStore();

  const { globalPermission } = useCurrentUserStore();

  const [
    isAddMembersModalOpen,
    { setFalse: closeAddMembersModal, setTrue: openAddMembersModal },
  ] = useBoolean(false);

  useMount(() => {
    loadMembers();
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const addUsersToCommunity = (usersIds: string[]) => {
    addMembersToCommunity(usersIds)
      .then(() => {
        loadMembers();
        closeAddMembersModal();
      })
      .catch((e) => {
        notification.error({ message: `Failed to add members: ${e}` });
      });
  };

  const filteredMembers = useMemo(() => {
    const normalizeSearch = debouncedSearch.toLowerCase();

    return members?.filter(
      (member) =>
        member.firstName?.toLowerCase().includes(normalizeSearch) ||
        member.lastName?.toLowerCase().includes(normalizeSearch) ||
        member.email?.toLowerCase().includes(normalizeSearch)
    );
  }, [debouncedSearch, members]);

  const canMemberAction = useCallback(
    (member: CommunityMember) => {
      return !!(
        permissions?.communityAddModerator ||
        globalPermission?.communityAddModerator ||
        (permissions?.communityAddEditor &&
          member.role !== CommunityRole.CommunityMoModerator)
      );
    },
    [permissions, globalPermission]
  );

  const canAddMember =
    permissions?.communityAddMember || globalPermission?.communityAddMember;

  return (
    <Stack vertical>
      <FixedContentHeader>
        <InnerPageHeader title="Members" icon={<ImageUserCheck />}>
          {canAddMember && (
            <Stack distribution="trailing">
              <Button
                type="primary"
                icon={<Plus />}
                onClick={openAddMembersModal}
              >
                Add members
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
                <Title level={4}>All members</Title>
              </Stack.Item>

              <Stack.Item>
                <Tag size="small">
                  {formatMemberText(membersCount || 0, 'community')}
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
                isLoading={isMembersLoading}
                currentPage={page}
                canMemberAction={canMemberAction}
                onChangeCurrentPage={setPage}
              />
            </Stack.Item>
          </Stack>
        </Card>
      </Page.Content>

      <AddMembersModal
        isOpen={isAddMembersModalOpen}
        communityId={communityId}
        isLoading={isAddMembersLoading}
        onClose={closeAddMembersModal}
        onAddUser={addUsersToCommunity}
      />
    </Stack>
  );
});
