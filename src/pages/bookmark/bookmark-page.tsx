import {
  Calendar,
  ChevronLeft,
  File05,
  MessageTextCircle02,
  PresentationChart02,
  Users01,
} from '@untitled-ui/icons-react';
import { Layout } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'src/components/common/Button/Button.tsx';
import { Menu } from 'src/components/common/menu/menu.tsx';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { Title } from 'src/components/common/Typography/Title.tsx';
import { pagesMap } from 'src/pages/authorized/routes.tsx';
import * as S from './bookmark.styled.ts';

export const BookmarkPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === pagesMap.myFavourites) {
      navigate(pagesMap.myFavouritesResources);
    }
  }, [location.pathname, navigate]);

  const menuItems = useMemo(() => {
    const items: Array<ItemType> = [
      {
        key: pagesMap.myFavouritesResources,
        label: 'Resources',
        icon: <File05 />,
      },
      {
        key: pagesMap.myFavouritesNews,
        label: 'News',
        icon: <S.NewsPaperIcon />,
      },
      {
        key: pagesMap.myFavouritesMeetings,
        label: 'Meetings',
        icon: <PresentationChart02 />,
      },
      {
        key: pagesMap.myFavouritesEvents,
        label: 'Events',
        icon: <Calendar />,
      },
      {
        key: pagesMap.myFavouritesCommunityPosts,
        label: 'Community posts',
        icon: <MessageTextCircle02 />,
      },
      {
        key: pagesMap.myFavouritesCommunities,
        label: 'Communities',
        icon: <Users01 />,
      },
    ];

    return items;
  }, []);

  return (
    <Layout>
      <Page.Sider
        fixed
        title={
          <Stack alignment="center">
            <Button
              type="link"
              icon={<ChevronLeft />}
              onClick={() => navigate(pagesMap.communities)}
            />
            <Title level={4}>My Favourites</Title>
          </Stack>
        }
      >
        <Menu
          mode="inline"
          items={menuItems}
          selectedKeys={[location?.pathname]}
          onClick={(e) => {
            navigate(e.key);
          }}
        />
      </Page.Sider>
      <Page.Content noPadding>
        <Outlet />
      </Page.Content>
    </Layout>
  );
};
