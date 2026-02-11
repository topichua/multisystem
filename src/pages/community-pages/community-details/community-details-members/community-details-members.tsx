import { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';
import { Col, Empty, Row, Skeleton } from 'antd';

import { Stack } from 'src/components/common/Stack/Stack';
import { Page } from 'src/components/common/page/page';

import { useCommunityDetailsStore } from '../community-details.provider';
import { MemberCard } from '../__components/member-card/member-card';

import * as S from './community-details-members.styled';

export const CommunityDetailsMembers = observer(() => {
  const { members, membersLoading, fetchMembers } = useCommunityDetailsStore();

  useEffect(() => {
    fetchMembers();
  }, []);

  const content = useMemo(() => {
    if (membersLoading) {
      return <Skeleton active />;
    }

    if (!members || members.length === 0) {
      return <Empty />;
    }

    return (
      <S.Wrapper>
        <Row gutter={[16, 16]}>
          {members.map((member) => (
            <Col md={8} sm={12} xs={24}>
              <MemberCard key={member.id} member={member} />
            </Col>
          ))}
        </Row>
      </S.Wrapper>
    );
  }, [members, membersLoading]);

  return (
    <Stack vertical>
      <Page.Content
        style={{ maxWidth: 1064, minHeight: 500, margin: '0 auto' }}
      >
        {content}
      </Page.Content>
    </Stack>
  );
});
