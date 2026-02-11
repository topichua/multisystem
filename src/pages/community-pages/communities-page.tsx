import { Compass03, HelpOctagon, HomeLine } from '@untitled-ui/icons-react';
import { Avatar, Layout, Skeleton } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { compact, isEmpty, isNil } from 'lodash';
import { observer } from 'mobx-react';
import { useCallback, useMemo } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, MenuLabel } from 'src/components/common/menu/menu';
import { Page } from 'src/components/common/page/page';

import { components } from 'src/styled/definitions/colors';
// import { SearchBar } from 'src/components/common/Searchbar/Searchbar';
import {
  CommunitiesPreferenceItem,
  CommunitiyDto,
} from 'src/transport/communities/communities.dto';

import { pagesMap } from '../authorized/routes';

import { useCommunityManagementStore } from './communities.page.provider';

export const CommunitiesPage = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  // const [search, setSearch] = useState('');

  const { preference, preferenceLoading, favourites, favouritesLoading } =
    useCommunityManagementStore();

  const sortCommunitiesByName = useCallback(
    (communities?: CommunitiesPreferenceItem[]) =>
      communities?.slice().sort((a, b) => a?.name?.localeCompare(b?.name)),
    []
  );

  const sortedTopFollowed = useMemo(
    () => sortCommunitiesByName(preference?.topJoined),
    [preference?.topJoined, sortCommunitiesByName]
  );

  const sortedTopModerated = useMemo(
    () => sortCommunitiesByName(preference?.topModerated),
    [preference?.topModerated, sortCommunitiesByName]
  );

  const sortedFavourites = useMemo(
    () => sortCommunitiesByName(favourites),
    [favourites, sortCommunitiesByName]
  );

  const generateCommunityMenuItems = useCallback(
    (communities: CommunitiesPreferenceItem[] | CommunitiyDto[]) =>
      communities?.map(({ name, alias, imageUrl, shortDescription }) => ({
        key: `/communities/${alias}`,
        label: <MenuLabel title={name} subtitle={shortDescription} />,
        icon: (
          <Avatar
            size={24}
            shape="square"
            src={
              imageUrl ||
              'https://shpadevstorage.blob.core.windows.net/images/community/ae5d71fd-f2ab-411b-9170-cf71eb1afdc1'
            }
            alt=""
          />
        ),
      })) || [],
    []
  );

  const getItems = useCallback(() => {
    const topCommunitiesMenuItems =
      !isNil(sortedTopFollowed) && !isEmpty(sortedTopFollowed)
        ? [
            ...generateCommunityMenuItems(sortedTopFollowed),
            {
              key: '/communities/explore?onlyJoined=true',
              label: (
                <Link to="/communities/explore?onlyJoined=true">See all</Link>
              ),
              style: { color: components.colors.brandColor },
            },
          ]
        : null;

    const topManageCommunitiesMenuItems =
      !isNil(sortedTopModerated) && !isEmpty(sortedTopModerated)
        ? [
            ...generateCommunityMenuItems(sortedTopModerated),
            {
              key: '/admin/communities-management',
              label: (
                <Link to="/admin/communities-management">Manage admin</Link>
              ),
              style: { color: components.colors.brandColor },
            },
          ]
        : null;

    const favoriteMenuItems =
      !isNil(sortedFavourites) && !isEmpty(sortedFavourites)
        ? [
            ...generateCommunityMenuItems(sortedFavourites),
            {
              key: '/communities/explore?onlyFavorite=true',
              label: (
                <Link to="/communities/explore?onlyFavorite=true">See all</Link>
              ),
              style: { color: components.colors.brandColor },
            },
          ]
        : null;

    const items: Array<ItemType> = compact([
      {
        key: '2',
        label: 'Welcome',
        children: [
          {
            key: pagesMap.communities,
            label: 'Home feed',
            icon: <HomeLine />,
          },
        ],
      },
      favoriteMenuItems && {
        key: '9',
        label: 'Favourites',
        children: favoriteMenuItems,
      },
      {
        key: '3',
        label: 'Community',
        children: [
          {
            key: pagesMap.exploreCommunities,
            label: 'Explore communities',
            icon: <Compass03 />,
          },
        ],
      },
      {
        key: '5',
        label: 'Meetings',
        children: [
          {
            key: pagesMap.exploreMeetings,
            label: 'Explore meetings',
            icon: <Compass03 />,
          },
        ],
      },
      topCommunitiesMenuItems && {
        key: '6',
        label: 'My communities',
        children: topCommunitiesMenuItems,
      },
      topManageCommunitiesMenuItems && {
        key: '7',
        label: 'Communities you manage',
        children: topManageCommunitiesMenuItems,
      },
      {
        key: 'other',
        label: 'Other',
        children: [
          {
            key: pagesMap.communitiesFaq,
            label: 'Frequently asked questions',
            icon: <HelpOctagon />,
          },
        ],
      },
    ]);

    return items;
  }, [
    sortedTopFollowed,
    generateCommunityMenuItems,
    sortedTopModerated,
    sortedFavourites,
  ]);

  return (
    <Layout>
      <Page.Sider fixed>
        {/* <div style={{ paddingTop: 20 }}>
          <SearchBar
            value={search}
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div> */}

        {preferenceLoading || favouritesLoading ? (
          <Skeleton active />
        ) : (
          <Menu
            mode="inline"
            defaultOpenKeys={['2', '3', '4', '5', '6', '7', '9', 'other']}
            selectedKeys={[location?.pathname]}
            onClick={(e) => navigate(e.key)}
            items={getItems()}
          />
        )}
      </Page.Sider>
      <Page.Content noPadding>
        <Outlet />
      </Page.Content>
    </Layout>
  );
});
