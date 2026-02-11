import { UsersCheck } from '@untitled-ui/icons-react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';

import { Button } from 'src/components/common/Button/Button.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { AgreementModal } from 'src/pages/explore-community/components/Content/AgreementModal.tsx';
import { JoinedDropdown } from 'src/pages/explore-community/components/Content/JoinedDropdown.tsx';
import { ExploreCommunityStore } from 'src/store/explore-community/explore-community-store.tsx';
import {
  CommunitiyDto,
  CommunityQuestion,
  CommunityStatus,
  CommunityUser,
} from 'src/transport/communities/communities.dto.ts';
import { communityApi } from 'src/transport/communities/communities.api.ts';

import { JoinQuestionsFormValues, QuestionsModal } from './QuestionsModal.tsx';

import * as S from '../common.styled.ts';

type TCommunityStoreInstance = InstanceType<typeof ExploreCommunityStore>;

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

  const [communityQuestions, setCommunityQuestions] = useState<
    CommunityQuestion[]
  >([]);
  const [getQuestionsCommunityId, setGetQuestionsCommunityId] = useState<
    string | null
  >(null);
  const [isQuestionsModalVisible, setIsQuestionsModalVisible] = useState(false);

  const joinCommunity = useCallback(
    (community: CommunitiyDto, answers?: JoinQuestionsFormValues) => {
      join(community.id, community.name, answers)
        .then(() => {
          if (community.isPublic) {
            navigate(`/communities/${community.alias}`);
          } else {
            setCurrentCommunity(null);
            setIsQuestionsModalVisible(false);
            setIsModalVisible(false);
          }
        })
        .catch(() => {
          notification.error({ message: 'Something went wrong. Try again' });
        });
    },
    [join, navigate]
  );

  const handleJoinCommunityWithAnswers = (answers: JoinQuestionsFormValues) => {
    if (!currentCommunity) return;
    joinCommunity(currentCommunity, answers);
  };

  const handleJoinCommunity = useCallback(
    async (community: CommunitiyDto) => {
      setGetQuestionsCommunityId(community.id);
      const communityQuestionsResp = await communityApi.getCommunityQuestions({
        communityId: community.id,
      });
      setCommunityQuestions(communityQuestionsResp.communityQuestions);
      setGetQuestionsCommunityId(null);

      if (community.isRequireAgreement) {
        setIsModalVisible(true);
        setCurrentCommunity(community);
        return;
      }

      if (communityQuestionsResp.communityQuestions.length > 0) {
        setIsQuestionsModalVisible(true);
        setCurrentCommunity(community);
        return;
      }

      joinCommunity(community);
    },
    [joinCommunity]
  );

  const confirmJoinCommunity = useCallback(() => {
    if (communityQuestions.length > 0 && !currentCommunity?.isPublic) {
      setIsQuestionsModalVisible(true);
      return;
    }

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
            loading={
              joinUnJoinCommunityLoadingId === community.id ||
              getQuestionsCommunityId === community.id
            }
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
    [
      isAdmin,
      joinUnJoinCommunityLoadingId,
      getQuestionsCommunityId,
      handleJoinCommunity,
      onClickUnJoin,
    ]
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
      agreementModal: (
        <AgreementModal
          currentCommunity={currentCommunity}
          onConfirm={confirmJoinCommunity}
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
          okButtonText={
            communityQuestions.length > 0 && !currentCommunity?.isPublic
              ? 'Next'
              : 'Join community'
          }
        />
      ),
      questionsModal: (
        <QuestionsModal
          questions={communityQuestions}
          open={isQuestionsModalVisible}
          okButtonProps={{
            loading: joinUnJoinCommunityLoadingId === currentCommunity?.id,
          }}
          onCancel={() => setIsQuestionsModalVisible(false)}
          onJoin={handleJoinCommunityWithAnswers}
        />
      ),
    }),
    [
      getActionsByStatus,
      currentCommunity,
      confirmJoinCommunity,
      isQuestionsModalVisible,
      communityQuestions,
      isModalVisible,
    ]
  );
};
