import { Drawer, Menu } from 'antd';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogo from 'src/assets/bond_mx_logo.svg?react';
import { pagesMap } from '../routes';

import { Menu01 } from '@untitled-ui/icons-react';
import { useMemo } from 'react';
import { ALL_CATEGORIES_PARAM } from 'src/pages/news-and-resources/utils/utils';
import * as S from './header-mobile.styled';
import { UserProfile } from './user-profile/user-profile';
import { Notifications } from './notifications/notifications';
import { ExpandingSearchInput } from './search/ExpandingSearchInput';
import { Stack } from 'src/components/common/Stack/Stack';

const DRAWER_WIDTH_PX = 330;

export const HeaderMobile = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const userMenuItems = useMemo(() => {
    const menuList = [];

    menuList.push(
      {
        key: 1,
        label: 'Home',
        linkTo: pagesMap.home,
      },
      {
        /*{
        key: 2,
        label: 'Marketplace',
        linkTo: pagesMap.marketPlace,
      }
      */
      },
      {
        key: 3,
        label: 'Communities',
        linkTo: pagesMap.communities,
      },
      // {
      //   key: 7,
      //   label: 'Member content',
      //   linkTo: `${pagesMap.memberContent}`,
      // }
    );

    return menuList;
  }, []);

  const handleMenuClick = ({ item }: { item: any }) => {
    const { linkTo } = item.props;

    const httpRegex = /^(https?:\/\/)/;
    if (httpRegex.test(linkTo)) {
      window.open(linkTo, '_blank');
    } else {
      navigate(linkTo);
    }

    setIsOpen(false);
  };

  return (
    <>
      <S.HeaderPlaceholer></S.HeaderPlaceholer>
      <S.Header>
        <Stack
          alignment="center"
          distribution="equalSpacing"
          style={{ width: '100%' }}
        >
          <Stack alignment="center">
            <Menu01 onClick={() => setIsOpen(true)} width={30} height={30} />
            <HeaderLogo
              onClick={() => navigate(pagesMap.home)}
              style={{ cursor: 'pointer', display: 'none' }}
            />
          </Stack>
          <Stack alignment="center">
            <ExpandingSearchInput />
            <Notifications />
            <UserProfile />
          </Stack>
        </Stack>
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setIsOpen(false)}
          open={isOpen}
          width={DRAWER_WIDTH_PX}
        >
          <Menu
            items={userMenuItems as any}
            onClick={handleMenuClick}
            style={{ borderInlineEnd: 0 }}
          />
        </Drawer>
      </S.Header>
    </>
  );
};
