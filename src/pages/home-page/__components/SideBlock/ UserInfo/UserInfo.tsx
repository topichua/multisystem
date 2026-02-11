import { Mail02, MarkerPin01, Phone } from '@untitled-ui/icons-react';
import { Typography } from 'antd';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { Title } from 'src/components/common/Typography/Title.tsx';
import { UserAvatar } from 'src/components/common/user-avatar/User-avatar.tsx';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout.tsx';
import * as S from '../side-block.styled.ts';

const { Text } = Typography;

const UserInfo = () => {
  const { user } = useCurrentUserStore();

  return (
    <Stack vertical>
      <Title level={4}>Welcome, {user?.firstName}!</Title>
      <S.StyledUserInfo vertical spacing="tight">
        <Stack alignment="center">
          <UserAvatar
            src={user?.avatarUrl}
            size={72}
            shape="circle"
            firstName={user?.firstName || ''}
            lastName={user?.lastName || ''}
            fontSize={30}
            style={{ marginBottom: 8 }}
          />
          <Stack vertical spacing="none">
            <Title level={5}>
              {user?.firstName} {user?.lastName}
            </Title>
            <Text type="secondary">{user?.pronoun}</Text>
          </Stack>
        </Stack>
        <S.StyledTextIcon>
          <Phone />
          <Text>{user?.mobile}</Text>
        </S.StyledTextIcon>
        <S.StyledTextIcon>
          <Mail02 />
          <Text>{user?.registeredEmail}</Text>
        </S.StyledTextIcon>
        <S.StyledTextIcon>
          <MarkerPin01 />
          <Text>
            {user?.postalAddress1 || '-'}, {user?.postalSuburb || '-'},{' '}
            {user?.postalPostcode || '-'}, {user?.postalState || '-'},{' '}
            {user?.postalCountry || '-'}
          </Text>
        </S.StyledTextIcon>
      </S.StyledUserInfo>
    </Stack>
  );
};

export default UserInfo;
