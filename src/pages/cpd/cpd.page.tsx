import {
  ArrowUpRight,
  BookOpen01,
  Certificate01,
  GlobeSlated02,
} from '@untitled-ui/icons-react';
import { Layout } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import compact from 'lodash/compact';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'src/components/common/menu/menu';
import { Page } from 'src/components/common/page/page';
import { pagesMap } from '../authorized/routes';

export const CpdPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items: Array<ItemType> = compact([
    {
      key: pagesMap.cpdTrackerPage,
      label: 'CPD Tracker',
      icon: <Certificate01 />,
    },
    {
      key: '3',
      label: 'Courses',
      children: [
        {
          key: pagesMap.cpdEnrolledPage,
          label: 'Enrolled',
          icon: <BookOpen01 />,
        },
        {
          key: pagesMap.cpdAllCourses,
          label: 'All courses',
          icon: <GlobeSlated02 />,
        },
      ],
    },
    {
      key: '4',
      label: 'External links',
      children: [
        {
          key: 'https://google.com',
          label: 'Search CPD',
          icon: <ArrowUpRight />,
        },
      ],
    },
  ]);

  const handleMenuClick = (e: { key: string }) => {
    if (e.key.startsWith('http')) {
      window.open(e.key, '_blank');
    } else {
      navigate(e.key);
    }
  };

  return (
    <Layout>
      <Page.Sider title="My CPD" fixed>
        <Menu
          mode="inline"
          defaultOpenKeys={['2', '3', '4', '6', '7', 'other']}
          selectedKeys={[location?.pathname]}
          onClick={handleMenuClick}
          items={items}
        />
      </Page.Sider>
      <Page.Content noPadding>
        <Outlet />
      </Page.Content>
    </Layout>
  );
};
