import { Stack } from 'src/components/common/Stack/Stack';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout.tsx';
import Announcement from 'src/pages/home-page/__components/announcement.tsx';
//import HomePageCommunities from 'src/pages/home-page/__components/Communities/home-page-communities.tsx';
import HomePageDivider from 'src/pages/home-page/__components/home-page-divider.tsx';
import HomePageNews from 'src/pages/home-page/__components/home-page-news.tsx';
import SideBlock from 'src/pages/home-page/__components/SideBlock/side-block.tsx';
import { isUserAdmin } from 'src/utils/post/user.ts';

import { HomePageMeetings } from './__components/Meetings/home-page-meetings.tsx';
import * as S from './home.page.styled';

export const HomePageNew = () => {
  const { user } = useCurrentUserStore();
  const isAdmin = isUserAdmin(user);

  return (
    <>
      <Announcement />
      <Stack distribution="center">
        <S.GridContainer className="grid">
          <S.Content>
            <HomePageNews />
            <HomePageDivider />
            {!isAdmin && (
              <>
                <HomePageMeetings />
                <HomePageDivider />
              </>
            )}
            {/* <HomePageCommunities />*/}
          </S.Content>
          <SideBlock />
        </S.GridContainer>
      </Stack>
    </>
  );
};
