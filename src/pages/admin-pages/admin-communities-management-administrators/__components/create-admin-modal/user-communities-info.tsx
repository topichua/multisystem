import { useBoolean } from 'ahooks';
import { Alert, Col, Row, Spin, Typography } from 'antd';
import { Fragment, useEffect, useState } from 'react';

import { Stack } from 'src/components/common/Stack/Stack';
import { Tag } from 'src/components/common/Tag/Tag';
import { Title } from 'src/components/common/Typography/Title';
import { communityApi } from 'src/transport/communities/communities.api';
import {
  CommunityRole,
  UserRelatedCommunity,
} from 'src/transport/communities/communities.dto';
import { CommunityMember } from 'src/transport/user/user.dto';
import { CommunityMemberRolesLabels } from 'src/utils/text-consts';

const { Text } = Typography;

type UserCommunitiesInfoProps = {
  user: CommunityMember;
};

export const UserCommunitiesInfo = ({ user }: UserCommunitiesInfoProps) => {
  const [userCommunities, setUserCommunities] = useState<
    UserRelatedCommunity[]
  >([]);

  const [
    isUserCommunitiesLoading,
    { setTrue: startLoading, setFalse: finishLoading },
  ] = useBoolean(false);

  useEffect(() => {
    fetchMemberCommunities();
  }, [user.id]);

  const fetchMemberCommunities = () => {
    startLoading();

    communityApi
      .getUserRelatedCommunities(user.id)
      .then((res) => {
        setUserCommunities(res.communities);
      })
      .finally(finishLoading);
  };

  const getCommunityRoleLabel = (role: CommunityRole) => {
    switch (role) {
      case CommunityRole.CommunityMoModerator:
        return CommunityMemberRolesLabels.Moderator;
      case CommunityRole.Editor:
        return CommunityMemberRolesLabels.Editor;
      default:
        return CommunityMemberRolesLabels.Member;
    }
  };

  const getCommunityRoleTagColor = (role: CommunityRole) => {
    switch (role) {
      case CommunityRole.CommunityMoModerator:
        return 'error';
      case CommunityRole.Editor:
        return 'blue';
      default:
        return 'success';
    }
  };

  if (isUserCommunitiesLoading)
    return (
      <Stack distribution="center">
        <Spin spinning />
      </Stack>
    );

  if (userCommunities.length === 0) return null;

  return (
    <Stack vertical spacing="tight">
      <Stack.Item>
        <Text type="secondary">
          {user.firstName} {user.lastName} is associated with the following
          communities:
        </Text>
      </Stack.Item>

      <Stack.Item>
        <Row gutter={[16, 8]}>
          {userCommunities.map((community) => (
            <Fragment key={community.community.id}>
              <Col span={12}>
                <Title level={5}>{community.community.name}</Title>
              </Col>
              <Col span={12}>
                {community.isBlocked ? (
                  <Tag color="error" size="small">
                    Blacklisted
                  </Tag>
                ) : (
                  <Tag
                    color={getCommunityRoleTagColor(community.role)}
                    size="small"
                  >
                    {getCommunityRoleLabel(community.role)}
                  </Tag>
                )}
              </Col>
            </Fragment>
          ))}
        </Row>
      </Stack.Item>

      <Alert
        message="Please review the user's current status in each community before proceeding"
        type="warning"
      />
    </Stack>
  );
};
