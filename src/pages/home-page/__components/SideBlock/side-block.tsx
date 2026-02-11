import { Divider } from 'src/components/common/Divider/Divider.tsx';
import UserInfo from 'src/pages/home-page/__components/SideBlock/ UserInfo/UserInfo.tsx';
import MyFavourites from 'src/pages/home-page/__components/SideBlock/MyFavourites.tsx';
import CpdProgress from './CPDProgress.tsx';
import UpcomingEvents from './Events/upcoming-events.tsx';
import * as S from './side-block.styled.ts';

const SideBlock = () => {
  return (
    <S.SideBlockStyled vertical>
      <UserInfo />
      <Divider spacing="none" />
      <CpdProgress />
      <Divider spacing="none" />
      <UpcomingEvents />
      <Divider spacing="none" />
      {/*<Communities />*/}
      <MyFavourites />
    </S.SideBlockStyled>
  );
};

export default SideBlock;
