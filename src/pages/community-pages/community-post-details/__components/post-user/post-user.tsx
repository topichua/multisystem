import { Typography } from 'antd';

import { Stack } from 'src/components/common/Stack/Stack';
import { UserAvatar } from 'src/components/common/user-avatar/User-avatar';
import { UserProfileDto } from 'src/transport/account/account.dto';
import { formatSingular } from 'src/utils/text';
import { CountLabels } from 'src/utils/text-consts';

import * as S from './post-user.styled';

const { Text } = Typography;

type PostUserProps = {
  user: UserProfileDto;
  createdUserPostCounter: number | null;
};

export const PostUser = ({ user, createdUserPostCounter }: PostUserProps) => {
  return (
    <S.Card>
      <S.Header>
        <S.UserInfo>
          <Stack wrap={false}>
            <UserAvatar
              size={96}
              shape="circle"
              firstName={user.firstName || ''}
              lastName={user.lastName || ''}
              src={user.avatarSrc}
            />

            <Stack spacing="extraTight" alignment="center">
              <S.NameText>
                {user?.firstName} {user?.lastName}
              </S.NameText>
              {user?.pronoun && <Text type="secondary">({user.pronoun})</Text>}
            </Stack>
          </Stack>
        </S.UserInfo>
      </S.Header>

      <S.Body>
        <Stack vertical>
          <Text>
            {formatSingular(createdUserPostCounter || 0, CountLabels.POSTS)}
          </Text>
          {/* <Stack vertical spacing="none">
            <Text type="secondary">ABOUT THIS AUTHOR</Text>
            <Text>ANZCAP-Reg. (ObsGynae, Neonatol.), MSHP</Text>
          </Stack> */}

          {/* <Row gutter={[6, 6]}>
            <Col lg={12} sm={24}>
              <S.InfoText>
                <Briefcase01 {...iconSizes} />
                Paediatric Doctor
              </S.InfoText>
            </Col>
            <Col lg={12} sm={24}>
              <S.InfoText>
                <MarkerPin01 {...iconSizes} />
                VIC
              </S.InfoText>
            </Col>
            <Col lg={12} sm={24}>
              <S.InfoText>
                <MessageDotsSquare {...iconSizes} />
                97 total posts
              </S.InfoText>
            </Col>
          </Row> */}

          {/* <Button block>View profile</Button> */}
        </Stack>
      </S.Body>
    </S.Card>
  );
};
