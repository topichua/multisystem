import { Empty, notification, Row } from 'antd';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal.tsx';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout.tsx';
import { useCommunityActions } from 'src/pages/explore-community/components/Content/useCommunityActions.tsx';
import { useExploreCommunityStore } from 'src/pages/explore-community/explore-communities.provider.tsx';
import {
  CommunitiyDto,
  CommunityStatus,
  CommunityUser,
} from 'src/transport/communities/communities.dto.ts';
import { formatSingular } from 'src/utils/text.ts';
import { CountLabels } from 'src/utils/text-consts.ts';
import { isUserAdmin } from 'src/utils/post/user.ts';

import { CommunityFavoriteItem } from './CommunityFavoriteItem.tsx';
import * as S from '../common.styled.ts';

type CommunitiesListProps = {
  communities: CommunityUser[];
};

export const CommunitiesList = observer(
  ({ communities }: CommunitiesListProps) => {
    const navigate = useNavigate();

    const {
      joinUnJoinCommunityLoadingId,
      follow,
      unfollow,
      addCommunityToFavorite,
      removeCommunityFromFavorite,
      addLikeToCommunity,
      removeLikeFromCommunity,
    } = useExploreCommunityStore();

    const { user } = useCurrentUserStore();

    const isCurrentUserAdmin = isUserAdmin(user);

    const [selectedCommunityForUnfollow, setSelectedCommunityForUnfollow] =
      useState<CommunitiyDto | null>(null);

    const { getActionsByStatus, agreementModal, questionsModal } =
      useCommunityActions({
        isAdmin: isCurrentUserAdmin,
        joinUnJoinCommunityLoadingId,
        join: follow,
        onClickUnJoin: setSelectedCommunityForUnfollow,
      });

    const handleUnfollowCommunity = () => {
      unfollow(selectedCommunityForUnfollow?.id as string).then(() => {
        setSelectedCommunityForUnfollow(null);
      });
    };

    const handleToggleFavorite =
      (communityId: string) => (isFavorite: boolean) => {
        const toggleFavoriteRequest = isFavorite
          ? addCommunityToFavorite
          : removeCommunityFromFavorite;

        const successMessage = isFavorite
          ? 'Successfully added to favourites'
          : 'Successfully removed from favourites';
        const errorMessage = isFavorite
          ? 'Error adding to favorites:'
          : 'Error removing from favorites:';

        return toggleFavoriteRequest(communityId)
          .then(() => {
            notification.success({ message: successMessage });
          })
          .catch((error) => {
            notification.error({
              message: `${errorMessage}: ${error.message || error}`,
            });
          });
      };

    const handleToggleLike = (communityId: string) => (isLiked: boolean) => {
      if (isLiked) {
        addLikeToCommunity(communityId);
      } else {
        removeLikeFromCommunity(communityId);
      }
    };

    const navigateToCommunity = (alias: string) => () => {
      navigate(`/communities/${alias}`);
    };

    if (communities.length === 0) {
      return <Empty description="No data" style={{ paddingTop: 24 }} />;
    }

    return (
      <Row gutter={[16, 16]}>
        {agreementModal}
        {questionsModal}
        {communities.map((item) => {
          const { community, status } = item;
          const categories = community.categories.map((c) => c.name);

          const isJoined =
            status === CommunityStatus.Joined ||
            community.isAutoJoin ||
            isCurrentUserAdmin;

          return (
            <S.StyledCol key={community.id} xl={8} md={12} xs={24}>
              <CommunityFavoriteItem
                initialIsFavorite={community.isFavorite}
                image={
                  community.imageUrl ||
                  'https://shpadevstorage.blob.core.windows.net/images/community/ae5d71fd-f2ab-411b-9170-cf71eb1afdc1'
                }
                isAutoJoin={community.isAutoJoin}
                categoriesName={
                  categories.length ? categories : ['Uncategorized']
                }
                title={community.name}
                info={[
                  community.isPublic ? 'Open community' : 'Private community',
                  `${community.membersCount} members`,
                  `${formatSingular(community.likesCount, CountLabels.LIKES)}`,
                  `${formatSingular(community.viewsCount, CountLabels.VIEWS)}`,
                ]}
                actions={getActionsByStatus(item)}
                onNavigateToCommunity={
                  isJoined ? navigateToCommunity(community.alias) : undefined
                }
                onToggleFavorite={handleToggleFavorite(community.id)}
                onToggleLike={handleToggleLike(community.id)}
                initialIsLiked={community.isLiked}
              />
            </S.StyledCol>
          );
        })}

        <ConfirmModal
          isOpen={!!selectedCommunityForUnfollow}
          confirmButtonProps={{ danger: true }}
          title="Leave Community?"
          description={`Are you sure you want to leave ${selectedCommunityForUnfollow?.name}? You can also turn off notifications for new posts.`}
          isLoading={
            joinUnJoinCommunityLoadingId === selectedCommunityForUnfollow?.id
          }
          confirmButtonText="Leave Community"
          onClose={() => setSelectedCommunityForUnfollow(null)}
          onConfirm={handleUnfollowCommunity}
        />
      </Row>
    );
  }
);
