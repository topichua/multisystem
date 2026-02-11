import {
  Bell04,
  Bookmark,
  Certificate02,
  Code01,
  CreditCard01,
  FileQuestion01,
  Heart,
  Home02,
  LayersThree02,
  LogOut01,
  MessageTextSquare02,
  NotificationBox,
  PasscodeLock,
  PieChart01,
  Receipt,
  Settings01,
  User03,
  UserCheck01,
  UserCircle,
} from '@untitled-ui/icons-react';
import { Badge, Grid, MenuProps, Popover, Typography } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Stack } from 'src/components/common/Stack/Stack';
import { UserAvatar } from 'src/components/common/user-avatar/User-avatar';
import { openLoginWithUserToken } from 'src/utils/route-utils';
import axios from '../../../../transport/axios/axios-bond-instance';
import { useCurrentUserStore } from '../../authorization.layout';
import { pagesMap } from '../../routes';
import * as S from './user-profile.styled';

const { useBreakpoint } = Grid;
const { Text } = Typography;

type UserProfileProps = {
  isAdminSide?: boolean;
};

export const UserProfile = observer(({ isAdminSide }: UserProfileProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const size = useBreakpoint();
  const { user, canAccessAdmin } = useCurrentUserStore();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [link, setLink] = useState(false);
  const [menuSelectedKey, setMenuSelectedKey] = useState<string>(
    location.pathname
  );

  const dividerStyle = { margin: '6px 0' };
  const itemStyle = { height: '100%', display: 'flex', alignItems: 'center' };
  const itemWithoutChildenStyle = { paddingLeft: 18 };

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile_settings',
      label: 'Profile & Settings',
      icon: <UserCircle />,
      children: [
        {
          key: pagesMap.accountDetailsPage,
          label: 'Account details',
          icon: <User03 />,
          style: itemStyle,
        },
        {
          key: pagesMap.changePasswordPage,
          label: 'Change password',
          icon: <PasscodeLock />,
          style: itemStyle,
        },
        {
          key: pagesMap.membershipProfilePage,
          label: 'Membership profile',
          icon: <Settings01 />,
          style: itemStyle,
        },
        {
          key: pagesMap.organisationDetailsPage,
          label: 'Organisation details',
          icon: <LayersThree02 />,
          style: itemStyle,
        },
        {
          key: pagesMap.dietaryPage,
          label: 'Dietary & special requirements',
          icon: <PieChart01 />,
          style: itemStyle,
        },
      ],
    },
    {
      key: 'preferences_interests',
      label: 'Preferences & Interests',
      icon: <Heart />,
      children: [
        {
          key: pagesMap.communicationPreferences,
          label: 'All communication preferences',
          icon: <Bell04 />,
          style: itemStyle,
        },
        {
          key: pagesMap.userCommunicationPreferences,
          label: 'My communication preferences',
          icon: <NotificationBox />,
          style: itemStyle,
        },
        {
          key: pagesMap.areaOfInterests,
          label: 'Practice Areas of Interest',
          icon: <FileQuestion01 />,
          style: itemStyle,
        },
        {
          key: pagesMap.userInterests,
          label: 'My Areas of Interest',
          icon: <UserCheck01 />,
          style: itemStyle,
        },
      ],
    },
    {
      key: 'activities_billing',
      label: 'Activities & Billing',
      icon: <CreditCard01 />,
      children: [
        {
          key: pagesMap.invoicesTable,
          label: 'Invoices',
          icon: <Receipt />,
          style: itemStyle,
        },
        {
          key: pagesMap.cpdTrackerPage,
          label: 'CPD',
          icon: <Certificate02 />,
          style: itemStyle,
        },
      ],
    },
    /* {
       key: 'help_support',
       label: 'Help & Support',
       icon: <HelpCircle />,
       children: [*/
    // {
    //   key: pagesMap.privacy,
    //   label: 'Privacy',
    //   icon: <Shield02 />,
    //   style: itemStyle,
    // },
    {
      key: pagesMap.contactUs,
      label: 'Contact us',
      icon: <MessageTextSquare02 />,
      style: { ...itemStyle, ...itemWithoutChildenStyle },
    },
    /*],
  },*/
    { key: 'divider1', type: 'divider', style: dividerStyle },
    {
      key: pagesMap.myFavourites,
      label: 'My Favourites',
      icon: <Bookmark />,
      style: { ...itemStyle, ...itemWithoutChildenStyle },
    },
    { key: 'divider2', type: 'divider', style: dividerStyle },
    isAdminSide
      ? {
          key: pagesMap.home,
          label: 'Home',
          icon: <Home02 />,
          style: { ...itemStyle, ...itemWithoutChildenStyle },
        }
      : canAccessAdmin
        ? {
            key: pagesMap.adminPageCommunitiesManagement,
            label: 'Admin',
            icon: <Code01 />,
            style: { ...itemStyle, ...itemWithoutChildenStyle },
          }
        : null,
    {
      key: 9,
      label: 'Log out',
      icon: <LogOut01 />,
      style: { ...itemStyle, ...itemWithoutChildenStyle },
    },
  ];

  const onClickMenuItem = (info: any) => {
    if (info?.key && Number.isNaN(parseInt(info.key))) {
      if (info.key.includes('resources')) {
        window.location = info.key;
      } else if (info?.key == 'communicationPreferences') {
        window.open(`${link}`, '_blank');
      } else {
        navigate(info.key, { replace: true });
      }
      setIsOpen(false);
    }
    if (info?.key == 9) {
      localStorage.removeItem('authorization');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userToken');

      navigate('/account/sign-in');
      setIsOpen(false);
    }
    if (info?.key == 4) {
      openLoginWithUserToken();
    }
  };

  useEffect(() => {
    axios.get('api/user/commprefsurl').then((res) => setLink(res.data));
  }, []);

  useEffect(() => {
    setMenuSelectedKey(location.pathname);
  }, [location]);

  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
    } else {
      setOpenKeys([]);
    }
  };

  const avatarContent = () => (
    <Stack vertical spacing="none">
      <Stack alignment="center" style={{ padding: '8px 16px' }}>
        <Badge
          dot
          status="success"
          offset={[-5, 40]}
          style={{ width: 10, minWidth: 10, height: 10 }}
        >
          <UserAvatar
            src={user?.avatarUrl}
            size={48}
            shape="circle"
            firstName={user?.firstName || ''}
            lastName={user?.lastName || ''}
          />
        </Badge>
        <Stack spacing="extraTight">
          <Text strong>
            {user?.firstName} {user?.lastName}
          </Text>
          {user?.pronoun && <Text type="secondary">({user?.pronoun})</Text>}
        </Stack>
      </Stack>
      <Stack.Item fill>
        <S.UserProfileMenu
          selectedKeys={[menuSelectedKey]}
          onSelect={onClickMenuItem}
          items={menuItems.filter((_) => _ != null)}
          style={{ borderInlineEnd: 0 }}
          mode={!size.xs ? undefined : 'inline'}
          openKeys={!size.xs ? undefined : openKeys}
          defaultOpenKeys={[]}
          onOpenChange={onOpenChange}
        />
      </Stack.Item>
    </Stack>
  );

  return (
    <Popover
      open={isOpen}
      onOpenChange={(visible) => {
        setIsOpen(visible);
      }}
      content={avatarContent}
      trigger="click"
      placement="bottomRight"
      arrow={false}
      overlayInnerStyle={{ padding: 4 }}
      overlayStyle={{ width: 320 }}
    >
      <UserAvatar
        src={user?.avatarUrl}
        size={40}
        shape="circle"
        firstName={user?.firstName || ''}
        lastName={user?.lastName || ''}
      />
    </Popover>
  );
});
