import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Page } from 'src/components/common/page/page';
import { SiderBackNav } from 'src/components/common/SiderBackNav/SiderBackNav';
import { pagesMap } from 'src/pages/authorized/routes.tsx';
import { ExploreCommunitiesMenu } from 'src/pages/explore-community/components/Menu.tsx';

export const ExporeCommunitiesPage = () => {
  return (
    <Layout>
      <Page.Sider
        fixed
        title={
          <SiderBackNav
            textLabel="Explore communities"
            pathToNavigateBackTo={pagesMap.communities}
          />
        }
      >
        <ExploreCommunitiesMenu />
      </Page.Sider>
      <Page.Content noPadding>
        <Outlet />
      </Page.Content>
    </Layout>
  );
};
