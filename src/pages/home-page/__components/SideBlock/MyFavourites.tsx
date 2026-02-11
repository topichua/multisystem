import { Bookmark } from '@untitled-ui/icons-react';
import { InternalLink } from 'src/components/common/Link/Link.tsx';
import { pagesMap } from 'src/pages/authorized/routes.tsx';
import * as S from 'src/pages/home-page/__components/SideBlock/side-block.styled.ts';

const MyFavourites = () => {
  return (
    <InternalLink href={pagesMap.myFavouritesResources} icon={<Bookmark />}>
      <S.LinkText>My Favourites</S.LinkText>
    </InternalLink>
  );
};

export default MyFavourites;
