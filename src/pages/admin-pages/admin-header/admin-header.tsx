import { useNavigate } from 'react-router-dom';
import AdministratorView from 'src/assets/admin_view.svg?react';
import { Stack } from 'src/components/common/Stack/Stack';
import { pagesMap } from 'src/pages/authorized/routes';

import * as S from './admin-header.styled';
import { UserProfile } from 'src/pages/authorized/header/user-profile/user-profile';

import config from 'src/projects/factory';
const HeaderLogo = config.logo;

export const AdminHeader = () => {
  const navigate = useNavigate();
  return (
    <>
      <S.HeaderPlaceholder />
      <S.HeaderWrapper>
        <Stack
          alignment="center"
          distribution="equalSpacing"
          style={{ flex: 1 }}
        >
          <Stack spacing="none" vertical>
            <HeaderLogo
              onClick={() => navigate(pagesMap.adminPageCommunitiesManagement)}
            />
            <AdministratorView />
          </Stack>

          <UserProfile isAdminSide />
        </Stack>
      </S.HeaderWrapper>
    </>
  );
};
