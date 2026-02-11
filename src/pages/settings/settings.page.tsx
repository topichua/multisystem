import {
  Bell04,
  FileQuestion01,
  LayersThree02,
  MessageTextSquare02,
  NotificationBox,
  PasscodeLock,
  PieChart01,
  Receipt,
  Settings01,
  User03,
  UserCheck01,
} from '@untitled-ui/icons-react';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Page } from 'src/components/common/page/page';
import styled from 'styled-components';
import axios from '../../transport/axios/axios-bond-instance';
import { pagesMap } from '../authorized/routes';

const MenuItemStyled = styled(Menu)`
  .ant-menu-sub {
    background-color: transparent !important;

    .ant-menu-item {
      padding-left: 58px !important;
    }
  }
`;

export const SettingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [link, setLink] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);

  const items: MenuProps['items'] = [
    {
      label: 'Account details',
      key: pagesMap.accountDetailsPage,
      icon: <User03 />,
    },
    {
      label: 'Organisation details',
      key: pagesMap.organisationDetailsPage,
      icon: <LayersThree02 />,
    },
    {
      label: 'Dietary & special requirements',
      key: pagesMap.dietaryPage,
      icon: <PieChart01 />,
    },
    {
      label: 'Membership profile',
      key: pagesMap.membershipProfilePage,
      icon: <Settings01 />,
    },
    {
      label: 'Change password',
      key: pagesMap.changePasswordPage,
      icon: <PasscodeLock />,
    },
    {
      key: pagesMap.communicationPreferences,
      label: 'All communication preferences',
      icon: <Bell04 />,
    },
    {
      key: pagesMap.userCommunicationPreferences,
      label: 'My communication preferences',
      icon: <NotificationBox />,
    },
    {
      key: pagesMap.areaOfInterests,
      label: 'Practice Areas of Interest',
      icon: <FileQuestion01 />,
    },
    {
      key: pagesMap.userInterests,
      label: 'My Areas of Interest',
      icon: <UserCheck01 />,
    },
    {
      label: 'Contact us',
      key: pagesMap.contactUs,
      icon: <MessageTextSquare02 />,
    },
    {
      label: 'Invoices',
      key: pagesMap.invoicesTable,
      icon: <Receipt />,
    },
    // {
    //   label: 'Privacy',
    //   key: pagesMap.privacy,
    //   icon: <Shield02 />,
    // },
  ];

  useEffect(() => {
    axios.get('api/user/commprefsurl').then((res) => setLink(res.data));
  }, []);

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location]);

  return (
    <Layout>
      <Page.Sider title="Settings" fixed>
        <MenuItemStyled
          style={{ border: 'none' }}
          selectedKeys={[selectedKey]}
          onClick={(e: any) => {
            if (e?.key == 'communicationPreferences') {
              window.open(`${link}`, '_blank');
            } else {
              navigate(e.key);
            }
          }}
          mode="inline"
          items={[...items.filter((x) => x)]}
        />
      </Page.Sider>
      <Page.Content noPadding>
        <Outlet />
      </Page.Content>
    </Layout>
  );
};
