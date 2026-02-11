import { Typography } from 'antd';

import {
  CommunityMember,
  CommunityRole,
} from 'src/transport/communities/communities.dto';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { Tag } from 'src/components/common/Tag/Tag';

import * as S from './member-card.styled';
import { CommunityMemberRolesLabels } from 'src/utils/text-consts';

const { Text } = Typography;

// const iconSizes = {
//   width: 16,
//   height: 16,
// };

type MemberCardProps = {
  member: CommunityMember;
};

export const MemberCard = ({ member }: MemberCardProps) => {
  return (
    <S.Card>
      <div className="content">
        <Stack
          vertical
          distribution="center"
          alignment="center"
          spacing="loose"
        >
          <Stack.Item>
            <S.Avatar
              shape="circle"
              size={96}
              firstName={member.firstName || 'Sam'}
              lastName={member.lastName || 'Last'}
              src={member.avatarUrl}
            />
          </Stack.Item>

          <Stack.Item>
            <Stack
              vertical
              alignment="center"
              spacing="extraTight"
              style={{ textAlign: 'center' }}
            >
              <Title
                level={4}
                ellipsis={{ rows: 1 }}
                title={`${member.firstName || 'Sam'} ${member.lastName || 'Last'}`}
              >
                {member.firstName || 'Same'} {member.lastName || 'Last'}
              </Title>
              <Text type="secondary">({member.pronoun || '-'})</Text>
              <Text type="secondary">{member.organisationName || '-'}</Text>
              <Text type="secondary">{member.homeState || '-'}</Text>
            </Stack>
          </Stack.Item>

          <Stack.Item>
            <Tag
              color={
                member.role === CommunityRole.CommunityMoModerator
                  ? 'error'
                  : 'success'
              }
            >
              {member.role === CommunityRole.CommunityMoModerator
                ? CommunityMemberRolesLabels.Moderator
                : CommunityMemberRolesLabels.Member}
            </Tag>
          </Stack.Item>
        </Stack>
      </div>

      {/* <Divider spacing="none" />

      <S.Button type="text" block size="large" icon={<Eye {...iconSizes} />}>
        View profile
      </S.Button> */}
    </S.Card>
  );
};
