import { UsersCheck } from '@untitled-ui/icons-react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'src/components/common/Button/Button.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { AgreementModal } from 'src/pages/bookmark/tabs/communities/AgreementModal.tsx';
import { JoinedDropdown } from 'src/pages/bookmark/tabs/communities/JoinedDropdown.tsx';
import { BookmarkStore } from 'src/store/bookmark/bookmark-store.tsx';
import {
  CommunitiyDto,
  CommunityStatus,
  CommunityUser,
} from 'src/transport/communities/communities.dto.ts';

import * as S from './common.styled.ts';

type TCommunityStoreInstance = InstanceType<typeof BookmarkStore>;

type UseCommunityActionsOptions = {
  isAdmin: boolean;
  joinUnJoinCommunityLoadingId: TCommunityStoreInstance['joinUnJoinCommunityLoadingId'];
  join: TCommunityStoreInstance['follow'];
  onClickUnJoin: (community: CommunitiyDto) => void;
};

export const useCommunityActions = ({
  isAdmin,
  joinUnJoinCommunityLoadingId,
  onClickUnJoin,
  join,
}: UseCommunityActionsOptions) => {
  const navigate = useNavigate();
  const [currentCommunity, setCurrentCommunity] =
    useState<CommunitiyDto | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const joinCommunity = useCallback(
    (community: CommunitiyDto) => {
      join(community.id, community.name).then(() => {
        if (community.isPublic) {
          navigate(`/communities/${community.alias}`);
        }
      });
    },
    [join, navigate]
  );

  const handleJoinCommunity = useCallback(
    (community: CommunitiyDto) => {
      if (community.isRequireAgreement) {
        setIsModalVisible(true);
        setCurrentCommunity(community);
      } else {
        joinCommunity(community);
      }
    },
    [joinCommunity]
  );

  const confirmJoinCommunity = useCallback(() => {
    if (currentCommunity) {
      joinCommunity(currentCommunity);
      setIsModalVisible(false);
      setCurrentCommunity(null);
    }
  }, [currentCommunity, joinCommunity]);

  const getFirstButton = useCallback(
    (communityData: CommunityUser) => {
      const { community, status } = communityData;

      if (isAdmin || community.isAutoJoin)
        return (
          <Button type="primary" block icon={<UsersCheck />}>
            Joined
          </Button>
        );

      if (!isAdmin && !status)
        return (
          <Button
            block
            loading={joinUnJoinCommunityLoadingId === community.id}
            key="Join"
            onClick={() => handleJoinCommunity(community)}
          >
            {community.isPublic ? 'Join Community' : 'Request to Join'}
          </Button>
        );

      if (status === CommunityStatus.Awaiting)
        return (
          <Button block disabled type="primary" key={CommunityStatus.Awaiting}>
            Pending Access
          </Button>
        );

      if (status === CommunityStatus.Joined)
        return (
          <JoinedDropdown onClickUnJoin={() => onClickUnJoin(community)} />
        );

      return null;
    },
    [joinUnJoinCommunityLoadingId, isAdmin]
  );

  const getActionsByStatus = useCallback(
    (community: CommunityUser) => {
      const { isAutoJoin } = community.community;

      const canViewCommunity =
        isAdmin || community.status === CommunityStatus.Joined || isAutoJoin;

      return [
        <Stack spacing="tight" distribution="center">
          <Stack.Item fill>{getFirstButton(community)}</Stack.Item>

          {canViewCommunity && (
            <S.ViewCommunityButton
              type="link"
              block
              onClick={() =>
                navigate(`/communities/${community.community.alias}`)
              }
            >
              View community
            </S.ViewCommunityButton>
          )}
        </Stack>,
      ];
    },
    [getFirstButton, isAdmin, onClickUnJoin, joinUnJoinCommunityLoadingId]
  );

  return useMemo(
    () => ({
      getActionsByStatus,
      agreementModal: isModalVisible && (
        <AgreementModal
          currentCommunity={currentCommunity}
          onConfirm={confirmJoinCommunity}
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      ),
    }),
    [getActionsByStatus, currentCommunity, confirmJoinCommunity, isModalVisible]
  );
};
