import { useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react';

import { Page } from 'src/components/common/page/page';

import { useMemberContentStore } from './members-content.provider';
import { MemberContentMenu } from './__components/Menu';

export const MemberContentLayout = observer(() => {
  const { loadPages } = useMemberContentStore();

  useEffect(() => {
    loadPages();
  }, []);

  return (
    <Layout>
      <Page.Sider title="Member content" fixed>
        <MemberContentMenu />
      </Page.Sider>
      <Page.Content noPadding>
        <Outlet />
      </Page.Content>
    </Layout>
  );
});
