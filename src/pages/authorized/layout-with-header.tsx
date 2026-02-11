import { Layout, Grid } from 'antd';
import { Outlet } from 'react-router-dom';

import { HeaderMobile } from './header/header-mobile';
import { Header } from './header/header';

const { useBreakpoint } = Grid;

export const LayoutWithHeader = () => {
  const size = useBreakpoint();

  return (
    <Layout>
      {!size.md ? <HeaderMobile /> : <Header />}
      <Outlet />
    </Layout>
  );
};
