import { Outlet } from 'react-router-dom';
import { Page } from 'src/components/common/page/page';
import { pagesMap } from 'src/pages/authorized/routes.tsx';
import { ExploreMeetingsMenu } from 'src/pages/explore-meetings/components/Menu.tsx';
import * as S from './explore-meetings.styled.ts';
import { SiderBackNav } from 'src/components/common/SiderBackNav/SiderBackNav.tsx';

export const ExporeMeetingsPage = () => {
  return (
    <S.StyledLayout>
      <S.StyledSider
        fixed
        title={
          <SiderBackNav
            textLabel="Explore meetings"
            pathToNavigateBackTo={pagesMap.communities}
          />
        }
      >
        <ExploreMeetingsMenu />
      </S.StyledSider>
      <Page.Content noPadding>
        <Outlet />
      </Page.Content>
    </S.StyledLayout>
  );
};
