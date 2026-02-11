import { useBoolean, useDebounce } from 'ahooks';
import { notification, Spin } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';

import { Button } from 'src/components/common/Button/Button.tsx';
import { SearchBar } from 'src/components/common/Searchbar/Searchbar.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { CommunityMeetingShare } from 'src/pages/admin-pages/admin-community/admin-community-meetings/admin-community-meetings.tsx';
import { useCommunityManagementStore } from 'src/pages/admin-pages/admin-community/admin-community.provider.tsx';
import { communityApi } from 'src/transport/communities/communities.api.ts';
import { CommunityMember } from 'src/transport/communities/communities.dto.ts';
import { EmptyUserList } from '../add-members-modal/__components/empty-components.tsx';
import * as S from '../add-members-modal/add-members-modal.styled.ts';
import { UsersList } from './users-list.tsx';

export type InviteMembersBodyProps = {
  handleCancel: () => void;
  communityId: string;
  meeting: CommunityMeetingShare | null;
  initMembers: string[];
  setInitMembers: (value: string[]) => void;
};

export const InviteMembersBody = observer(
  ({
    handleCancel,
    communityId,
    meeting,
    initMembers,
    setInitMembers,
  }: InviteMembersBodyProps) => {
    const { loadMeetings } = useCommunityManagementStore();
    const [fetchedUsers, setFetchedUsers] = useState<CommunityMember[]>([]);
    const [shownUsers, setShownUsers] = useState<CommunityMember[]>([]);
    const [keyword, setKeyword] = useState('');
    const debouncedKeyword = useDebounce(keyword, { wait: 500 });
    const [selectedUsersIds, setSelectedUsersIds] = useState<string[]>([]);
    const [isLoading, { setTrue: startLoading, setFalse: stopLoading }] =
      useBoolean(false);

    useEffect(() => {
      if (debouncedKeyword.trim().length > 2) {
        setShownUsers(
          fetchedUsers.filter((user) => {
            const fullName = `${user.firstName} ${user.lastName}`;
            return fullName
              .toLowerCase()
              .includes(debouncedKeyword.toLowerCase());
          })
        );
      } else {
        setShownUsers([]);
      }
    }, [debouncedKeyword, fetchedUsers]);

    useEffect(() => {
      startLoading();
      communityApi
        .getCommunityMembers({ id: communityId })
        .then(({ communityMembers }) => setFetchedUsers(communityMembers))
        .finally(stopLoading);
    }, [communityId, startLoading, stopLoading]);

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

    useEffect(() => {
      setShownUsers([]);
      setSelectedUsersIds([]);
      setFetchedUsers([]);
    }, [meeting]);

    useEffect(() => {
      if (keyword.trim().length < 3) {
        setShownUsers([]);
      }
    }, [keyword]);

    const handleSubmit = () => {
      if (!meeting) return;
      startLoading();
      communityApi
        .addMemberToMeeting(communityId, meeting.id, selectedUsersIds)
        .then(() => {
          setInitMembers([...initMembers, ...selectedUsersIds]);
          notification.success({ message: 'Invites sent' });
          loadMeetings();
        })
        .finally(stopLoading);
    };

    return (
      <Stack vertical spacing="extraLoose">
        <SearchBar
          style={{ marginTop: 24 }}
          value={keyword}
          size="large"
          placeholder="Search by name or email"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Spin spinning={isLoading}>
          <S.ListWrapper
            alignCenter={shownUsers.length === 0 || keyword.length < 3}
          >
            <UsersList
              users={shownUsers}
              toggleUserId={toggleUserId}
              selectedUsersIds={selectedUsersIds}
              initUsersIds={initMembers}
            />
            {!isLoading && (
              <EmptyUserList keyword={keyword} usersCount={shownUsers.length} />
            )}
          </S.ListWrapper>
        </Spin>
        <Stack alignment="center" distribution="trailing">
          <Stack.Item>
            <Stack alignment="center">
              <Button
                onClick={() => {
                  handleCancel();
                  setSelectedUsersIds([]);
                  setKeyword('');
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                disabled={selectedUsersIds.length === 0 || isLoading}
              >
                Send invites
              </Button>
            </Stack>
          </Stack.Item>
        </Stack>
      </Stack>
    );
  }
);
