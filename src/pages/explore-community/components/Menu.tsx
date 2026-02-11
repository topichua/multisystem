import { Spin } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { observer } from 'mobx-react';
import { useEffect, useMemo } from 'react';
import { useExploreCommunityStore } from '../explore-communities.provider';
import { useCheckedMenuItems } from '../hooks/useCheckedMenuItems';
import * as S from './common.styled.ts';

export const ExploreCommunitiesMenu = observer(() => {
  const {
    initCategories,
    isFavourited,
    toogleFavourited,
    getAllCategories,
    checkedCategoriesParents,
    checkedCategoriesChildren,
    setCheckedCategoriesParents,
    setCheckedCategoriesChildren,
    isCategoryLoading,
  } = useExploreCommunityStore();

  useEffect(() => {
    getAllCategories();
  }, []);

  const { menuItems: menuInterestGroup } = useCheckedMenuItems(
    initCategories,
    checkedCategoriesParents,
    checkedCategoriesChildren,
    setCheckedCategoriesParents,
    setCheckedCategoriesChildren
  );

  const menuItems = useMemo(() => {
    const items: Array<ItemType> = [
      {
        key: 'Favourites',
        label: 'Favourites',
        icon: (
          <S.StyledBookmark
            className="bookmark-favourited"
            isActive={isFavourited}
          />
        ),
        onClick: toogleFavourited,
      },
      ...menuInterestGroup,
    ];

    return items;
  }, [isFavourited, menuInterestGroup, toogleFavourited]);

  return (
    <Spin spinning={isCategoryLoading}>
      <S.StyledMenu
        mode="inline"
        selectedKeys={[]}
        defaultOpenKeys={['Favourites']}
        items={menuItems}
      />
    </Spin>
  );
});
