import { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, MenuProps, Tooltip } from 'antd';
import { Annotation, Announcement01, LogOut02 } from '@untitled-ui/icons-react';
import { observer } from 'mobx-react';

import { pagesMap } from '../authorized/routes';
import { useCurrentUserStore } from '../authorized/authorization.layout';

import { AdminHeader } from './admin-header/admin-header';

import * as S from './admin-pages-layout.styled';

type MenuItem = Required<MenuProps>['items'][number];

export const AdminPagesLayout = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, canAccessAdmin, globalPermission } = useCurrentUserStore();

  useEffect(() => {
    if (!canAccessAdmin) {
      navigate('/');
    }
  }, [user, canAccessAdmin]);

  const items: MenuItem[] = useMemo(() => {
    return [
      {
        key: pagesMap.adminPageCommunitiesManagement,
        icon: (
          <Tooltip title="Communities" placement="right">
            <Annotation />
          </Tooltip>
        ),
      },
      ...(globalPermission?.generalAnnouncements
        ? [
            {
              key: pagesMap.announcement,
              icon: (
                <Tooltip title="Announcement" placement="right">
                  <Announcement01 />
                </Tooltip>
              ),
            },
          ]
        : []),

      {
        type: 'divider',
      },
      {
        key: pagesMap.home,
        icon: (
          <Tooltip title="Exit admin panel" placement="right">
            <LogOut02 style={{ transform: 'rotate(180deg)' }} />
          </Tooltip>
        ),
      },
    ];
  }, [user, globalPermission]);

  const selectedLinks = useMemo(() => {
    const matchedItem = items.find(
      (item) =>
        item &&
        item.key &&
        (location.pathname === item.key ||
          location.pathname.startsWith(item.key as string))
    );

    return matchedItem ? [matchedItem.key as string] : [];
  }, [location.pathname, items]);

  return (
    <Layout style={{ background: '#FCFCFD', minHeight: '100vh' }}>
      <AdminHeader />
      <Layout>
        <S.Sider width={74}>
          <S.Menu
            mode="inline"
            items={items}
            style={{ height: '100%', borderRight: 0 }}
            selectedKeys={selectedLinks}
            onClick={(e) => {
              navigate(e.key);
            }}
          />
        </S.Sider>
        <Layout style={{ background: '#FCFCFD' }}>
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  );
});
