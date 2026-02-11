import { ChevronLeft } from '@untitled-ui/icons-react';
import { Avatar, Skeleton, Typography } from 'antd';

import { HttpStatusCode } from 'axios';
import { observer } from 'mobx-react';
import { useMemo } from 'react';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';

import { Button } from 'src/components/common/Button/Button';
import { Divider } from 'src/components/common/Divider/Divider';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import LikeButton from 'src/components/common/LikeButton/LikeButton.tsx';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
import { pagesMap } from 'src/pages/authorized/routes';
import {
  ExploreButton,
  StyledResult,
} from 'src/pages/explore-community/explore-communities.styled.ts';
import { CommunityStatus } from 'src/transport/communities/communities.dto';
import { isUserAdmin } from 'src/utils/post/user';
import { AccessMessage } from './__components/access-message/access-message';
import { HeaderActions } from './__components/header-actions/header-actions';
import { useCommunityDetailsStore } from './community-details.provider';

const { Paragraph } = Typography;

const { Text } = Typography;

export const CommunityDetails = observer(() => {
  const navigate = useNavigate();
  const { alias } = useParams();
  const {
    community,
    loading,
    status,
    setStatus,
    addLikeToCommunity,
    removeLikeFromCommunity,
    communityFetchError,
  } = useCommunityDetailsStore();
  const baseUrl = `${window.location.origin}`;

  const { user } = useCurrentUserStore();
  const isAdmin = isUserAdmin(user);

  const isJoined =
    isAdmin || status === CommunityStatus.Joined || community?.isAutoJoin;

  const navItems = useMemo(() => {
    return [
      { path: '', label: 'About' },
      { path: '/posts', label: 'Discussion' },
      { path: '/members', label: 'Members' },
      { path: '/resources', label: 'Assets' },
      { path: '/meetings', label: 'Meetings' },
    ];
  }, []);

  const toggleJoinCommunity = (isJoined: boolean) => {
    setStatus(isJoined ? CommunityStatus.Joined : null);

    if (!isJoined) {
      navigate('/communities/explore');
    }
  };

  const handleToggleLike = (isLiked: boolean) => {
    if (isLiked) {
      addLikeToCommunity();
    } else {
      removeLikeFromCommunity();
    }
  };

  if (loading) {
    return (
      <Page.Content>
        <Skeleton active />
      </Page.Content>
    );
  }

  if (
    communityFetchError?.statusCode === HttpStatusCode.BadRequest ||
    communityFetchError?.statusCode === HttpStatusCode.Forbidden
  )
    return <AccessMessage status={communityFetchError?.statusCode} />;

  return isJoined ? (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          fillChildren={true}
          icon={
            <Button
              type="link"
              icon={
                <ChevronLeft
                  onClick={() => navigate(pagesMap.exploreCommunities)}
                />
              }
            />
          }
        >
          <Stack distribution="equalSpacing" alignment="center">
            <Stack alignment="center">
              <Avatar
                shape="square"
                size={36}
                src={
                  community?.imageUrl ||
                  'https://shpadevstorage.blob.core.windows.net/images/community/ae5d71fd-f2ab-411b-9170-cf71eb1afdc1'
                }
              />
              <Stack vertical spacing="none">
                <Title level={4}>{community?.name}</Title>
                <Text>{community?.shortDescription}</Text>
              </Stack>
              <LikeButton
                initialIsLiked={!!community?.isLiked}
                onToggleLike={handleToggleLike}
              />
            </Stack>

            <HeaderActions
              status={status}
              community={community}
              isAdmin={isAdmin}
              onToggleJoinCommunity={toggleJoinCommunity}
            />
          </Stack>
        </InnerPageHeader>

        <InnerPageHeader>
          <Stack alignment="center">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={'/communities/' + alias + item.path}
                end
              >
                {({ isActive }) => (
                  <Button type={isActive ? 'primary' : 'text'} size="small">
                    {item.label}
                  </Button>
                )}
              </NavLink>
            ))}
            <Divider type="vertical" />
            <Paragraph
              copyable={{
                tooltips: ['Copy link to community', 'Copied'],
                text: `${baseUrl}/communities/${community?.alias}`,
              }}
              style={{ margin: 0 }}
            ></Paragraph>
          </Stack>
        </InnerPageHeader>
      </FixedContentHeader>
      <Outlet />
    </>
  ) : (
    <StyledResult
      status="403"
      title="Oops!"
      subTitle="Only members of this community can view it!"
      extra={
        <ExploreButton
          type="primary"
          onClick={() => navigate('/communities/explore')}
          style={{ margin: '0 auto' }}
        >
          Explore communities
        </ExploreButton>
      }
    />
  );
});
