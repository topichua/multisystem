import {
  CalendarDate,
  ClockRewind,
  FileCheck02,
  Folder,
  HomeLine,
  ImageUserCheck,
  ImageUserRight,
  ImageUserX,
  MessageAlertCircle,
  MessageAlertSquare,
  NotificationText,
  Rss02,
  Settings02,
} from '@untitled-ui/icons-react';
import { Skeleton } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { Menu, MenuLabel } from 'src/components/common/menu/menu';
import { Page } from 'src/components/common/page/page';

import { AdminHeader } from '../admin-header/admin-header';

import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
import { isUserAdmin } from 'src/utils/post/user';
import { SidebarHeader } from './__components/sidebar-header/sidebar-header';
import { useCommunityManagementStore } from './admin-community.provider';

export const AdminCommunityLayout = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const {
    community,
    isCommunityLoading,
    isCommunityPostsStatisticsLoading,
    communityPostsStatistics,
    permissions,
    loadCommunity,
    loadCommunityPostsStatistic,
  } = useCommunityManagementStore();
  const { user, globalPermission } = useCurrentUserStore();

  useEffect(() => {
    loadCommunity();
    loadCommunityPostsStatistic();
  }, []);

  const isAdmin = isUserAdmin(user);

  const menuItems = useMemo(() => {
    return [
      {
        key: `/admin/community/${id}/about`,
        label: 'Community home',
        icon: <HomeLine />,
      },
      {
        key: '2',
        label: 'Admin tools',
        children: [
          {
            key: `/admin/community/${id}/posts`,
            label: (
              <MenuLabel
                title="All posts"
                subtitle={
                  (communityPostsStatistics?.allPostsCount ?? 0) +
                  ' total posts'
                }
              />
            ),
            icon: <Rss02 />,
          },
          {
            key: `/admin/community/${id}/pending-posts`,
            label: (
              <MenuLabel
                title="Posts pending approval"
                subtitle={`${communityPostsStatistics?.pendingPostsCount ?? 0} post for approval`}
              />
            ),
            icon: <NotificationText />,
          },
          permissions?.postDelete || globalPermission?.postDelete
            ? {
                key: `/admin/community/${id}/reported-posts`,
                label: (
                  <MenuLabel
                    title="Reported posts"
                    subtitle={`${communityPostsStatistics?.reportedPostsCount ?? '0'} reported posts`}
                  />
                ),
                icon: <MessageAlertSquare />,
              }
            : null,
          permissions?.commentDelete || globalPermission?.commentDelete
            ? {
                key: `/admin/community/${id}/reported-comments`,
                label: (
                  <MenuLabel
                    title="Reported comments"
                    subtitle={`${communityPostsStatistics?.reportedPostCommentsCount ?? 0} reported comments`}
                  />
                ),
                icon: <MessageAlertCircle />,
              }
            : null,
          {
            key: `/admin/community/${id}/archive`,
            label: (
              <MenuLabel
                title="Archived posts"
                subtitle={`${communityPostsStatistics?.archivedPostsCount ?? 0} archived posts`}
              />
            ),
            icon: <ClockRewind />,
          },
          {
            key: `/admin/community/${id}/assets`,
            label: <MenuLabel title="Assets" subtitle={`Manage post assets`} />,
            icon: <Folder />,
          },
          isAdmin
            ? {
                key: `/admin/community/${id}/membership-requirements`,
                label: <MenuLabel title="Membership requirements" />,
                icon: <FileCheck02 />,
              }
            : null,
          isAdmin
            ? {
                key: `/admin/community/${id}/settings`,
                label: 'Admin settings',
                icon: <Settings02 />,
              }
            : null,
        ].filter((_) => _ != null),
      },
      {
        key: '3',
        label: 'Community',
        children: [
          {
            key: `/admin/community/${id}/members`,
            label: 'Members',
            icon: <ImageUserCheck />,
          },
          {
            key: `/admin/community/${id}/deleted-members`,
            label: 'Removed members',
            icon: <ImageUserRight />,
          },
          permissions?.communityBlacklist ||
          globalPermission?.communityBlacklist
            ? {
                key: `/admin/community/${id}/banned-members`,
                label: 'Blacklist',
                icon: <ImageUserX />,
              }
            : null,
          {
            key: `/admin/community/${id}/meetings`,
            label: 'Meetings',
            icon: <CalendarDate />,
          },
        ].filter((_) => _ != null),
      },
    ];
  }, [permissions, globalPermission, communityPostsStatistics]);

  const getSelectedKeys = () => {
    const matchedItem = menuItems
      .flatMap((item) => (item.children ? item.children : [item]))
      .find((menuItem) => {
        if (menuItem?.key) {
          return location.pathname.startsWith(menuItem.key);
        }
      });

    return matchedItem ? [matchedItem.key] : [];
  };

  if (
    (isCommunityLoading && community === null) ||
    (isCommunityPostsStatisticsLoading && communityPostsStatistics === null)
  ) {
    return <Skeleton active />;
  }

  return (
    <>
      <AdminHeader />
      <Page.Content noPadding>
        <Page.Sider fixed title={<SidebarHeader community={community} />}>
          <Menu
            mode="inline"
            selectedKeys={getSelectedKeys()}
            defaultOpenKeys={['2', '3']}
            onClick={(e) => navigate(e.key)}
            items={menuItems}
          />
        </Page.Sider>

        <Page.Content noPadding>
          <Outlet />
        </Page.Content>
      </Page.Content>
    </>
  );
});
