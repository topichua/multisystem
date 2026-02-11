import { Switch } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useMemo } from 'react';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { Title } from 'src/components/common/Typography/Title.tsx';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout.tsx';
import { Categories } from 'src/pages/explore-community/components/Categories.tsx';
import { useExploreCommunityStore } from 'src/pages/explore-community/explore-communities.provider.tsx';
import * as S from 'src/pages/explore-community/explore-communities.styled.ts';
import { CommunityStatus } from 'src/transport/communities/communities.dto.ts';
import { isUserAdmin } from 'src/utils/post/user.ts';
import { CountLabels } from 'src/utils/text-consts.ts';
import { formatSingular } from 'src/utils/text.ts';

export const Header = observer(() => {
  const {
    allCommunities,
    isOnlyJoined,
    toogleOnlyJoined,
    isCommunityLoading,
    setOnlyJoined,
  } = useExploreCommunityStore();
  const { user } = useCurrentUserStore();
  const isAdmin = isUserAdmin(user);

  const joinCommunitiesCount = useMemo(() => {
    return allCommunities.filter(
      (c) => c.joinedAt !== null && c.status === CommunityStatus.Joined
    ).length;
  }, [allCommunities]);

  useEffect(() => {
    if (joinCommunitiesCount === 0) {
      setOnlyJoined(false);
    }
  }, [joinCommunitiesCount, setOnlyJoined]);

  return (
    <S.StyledInnerPageHeader>
      <Stack vertical spacing="none" style={{ width: '100%' }}>
        <Stack distribution="equalSpacing" alignment="center">
          <Title level={5}>
            {!isCommunityLoading
              ? formatSingular(allCommunities.length, CountLabels.COMMUNITIES)
              : 'Loading...'}
          </Title>
          {!isAdmin && joinCommunitiesCount > 0 && (
            <Stack alignment="center">
              <Title level={5}>
                {!isCommunityLoading
                  ? `Show only ${joinCommunitiesCount} joined`
                  : 'Loading...'}
              </Title>
              <Switch value={isOnlyJoined} onChange={toogleOnlyJoined} />
            </Stack>
          )}
        </Stack>
        <Categories />
      </Stack>
    </S.StyledInnerPageHeader>
  );
});
