import { Divider } from 'src/components/common/Divider/Divider.tsx';
import UserInfo from 'src/pages/home-page/__components/SideBlock/ UserInfo/UserInfo.tsx';
import MyFavourites from 'src/pages/home-page/__components/SideBlock/MyFavourites.tsx';
import CpdProgress from './CPDProgress.tsx';
import UpcomingEvents from './Events/upcoming-events.tsx';
import * as S from './side-block.styled.ts';

const SideBlock = () => {
  const hidecpd = true;
  return (
    <S.SideBlockStyled vertical>
      <UserInfo />
      <Divider spacing="none" />
     {!hidecpd  &&<CpdProgress />}
      <Divider spacing="none" />
     {!hidecpd  &&<UpcomingEvents />}
      <Divider spacing="none" />
      {/*<Communities />*/}
      <MyFavourites />
    </S.SideBlockStyled>
  );
};

export default SideBlock;
