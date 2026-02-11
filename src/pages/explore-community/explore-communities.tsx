import { useDebounce } from 'ahooks';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useExploreCommunityStore } from 'src/pages/explore-community/explore-communities.provider.tsx';
import { Content } from './components/Content/Content.tsx';
import { Header } from './components/Header';

export const ExploreCommunities = observer(() => {
  const query = new URLSearchParams(useLocation().search);
  const onlyJoined = query.get('onlyJoined');
  const onlyFavorite = query.get('onlyFavorite');

  const {
    getAllCommunities,
    checkedCategoriesChildren,
    checkedCategoriesParents,
    isFavourited,
    isOnlyJoined,
    setOnlyJoined,
    setOnlyFavourited,
  } = useExploreCommunityStore();

  useEffect(() => {
    setOnlyJoined(onlyJoined === 'true');
  }, [onlyJoined, setOnlyJoined]);

  useEffect(() => {
    setOnlyFavourited(onlyFavorite === 'true');
  }, [onlyFavorite, setOnlyFavourited]);

  const debouncedCheckedCategoriesChildren = useDebounce(
    checkedCategoriesChildren,
    { wait: 400 }
  );
  const debouncedCheckedCategoriesParents = useDebounce(
    checkedCategoriesParents,
    { wait: 400 }
  );
  const debouncedIsFavourited = useDebounce(isFavourited, { wait: 400 });
  const debouncedIsOnlyJoined = useDebounce(isOnlyJoined, { wait: 400 });

  useEffect(() => {
    getAllCommunities();
  }, [
    debouncedCheckedCategoriesChildren,
    debouncedCheckedCategoriesParents,
    debouncedIsFavourited,
    debouncedIsOnlyJoined,
    getAllCommunities,
  ]);

  return (
    <>
      <Header />
      <Content />
    </>
  );
});
