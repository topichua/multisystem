import { useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';

import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Stack } from 'src/components/common/Stack/Stack';
import { Tabs } from 'src/components/common/Tabs/Tabs';
import { pagesMap } from 'src/pages/authorized/routes';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';

import * as S from './admin-communities-management.styled';

export const AdminCommunitiesManagement = observer(() => {
  const navigate = useNavigate();

  const { user, globalPermission } = useCurrentUserStore();

  const items = useMemo(() => {
    const tabs = [
      ...(globalPermission?.generalCommunities
        ? [
            {
              label: 'Communities',
              key: pagesMap.adminPageCommunitiesManagement,
            },
          ]
        : []),

      ...(globalPermission?.generalCategories
        ? [
            {
              label: 'Categories',
              key: pagesMap.adminPageCommunitiesManagementCategories,
            },
          ]
        : []),

      ...(globalPermission?.generalTags
        ? [
            {
              label: 'Tags',
              key: pagesMap.adminPageCommunitiesManagementTags,
            },
          ]
        : []),

      ...(globalPermission?.generalManagers
        ? [
            {
              label: 'Managers',
              key: pagesMap.adminPageCommunitiesManagementAdministrators,
            },
          ]
        : []),

      ...(globalPermission?.generalTc
        ? [
            {
              label: 'Global Terms and Conditions',
              key: pagesMap.adminGlobalTermsConditionsPage,
            },
          ]
        : []),

      ...(globalPermission?.generalFaq
        ? [
            {
              label: 'FAQ',
              key: pagesMap.adminPageCommunitiesManagementFAQ,
            },
          ]
        : []),
    ];

    return tabs;
  }, [user, globalPermission]);

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader>
          <Stack fill style={{ flex: 1 }}>
            <S.TabsWrapper>
              <Tabs
                items={items}
                activeKey={location?.pathname}
                onChange={(key) => navigate(key)}
              />
            </S.TabsWrapper>
          </Stack>
        </InnerPageHeader>
      </FixedContentHeader>

      <Outlet />
    </>
  );
});
