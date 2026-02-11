import { Col, Row, Skeleton } from 'antd';
import { observer } from 'mobx-react';
import { useEffect } from 'react';

import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { CommunityAboutCard } from 'src/components/community/CommunityAboutCard/CommunityAboutCard';
import { CommunityDetailsCard } from 'src/components/community/CommunityDetailsCard/CommunityDetailsCard';

import { useCommunityDetailsStore } from '../community-details.provider';

export const CommunityDetailsAbout = observer(() => {
  const {
    about,
    community,
    isAboutLoading,
    fetchCommunityAbout,
    likesCount,
    joinedAt,
  } = useCommunityDetailsStore();

  useEffect(() => {
    fetchCommunityAbout();
  }, []);

  if (isAboutLoading) {
    return (
      <Page.Content>
        <Skeleton active />
      </Page.Content>
    );
  }

  return (
    <Stack vertical>
      <Page.Content
        style={{ maxWidth: 1064, minHeight: 500, margin: '0 auto' }}
      >
        <Row gutter={[16, 16]}>
          <Col sm={14} xs={24}>
            <CommunityAboutCard about={about} />
          </Col>
          <Col sm={10} xs={24}>
            {community && (
              <CommunityDetailsCard
                community={community}
                likesCount={likesCount}
                joinedAt={joinedAt}
              />
            )}
          </Col>
        </Row>
      </Page.Content>
    </Stack>
  );
});
