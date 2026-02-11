import { Typography } from 'antd';
import { observer } from 'mobx-react';
import { useCallback, useMemo } from 'react';
import { Badge } from 'src/components/common/Badge/Badge.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { CategoryBadges } from 'src/pages/explore-community/components/CategoryBadges.tsx';
import { useExploreCommunityStore } from 'src/pages/explore-community/explore-communities.provider.tsx';

const { Text } = Typography;

export const Categories = observer(() => {
  const {
    initCategories,
    checkedCategoriesParents,
    checkedCategoriesChildren,
    setCheckedCategoriesParents,
    setCheckedCategoriesChildren,
  } = useExploreCommunityStore();

  const isEmpty = useMemo(
    () =>
      checkedCategoriesParents.length === 0 &&
      Object.keys(checkedCategoriesChildren).length === 0,
    [checkedCategoriesParents, checkedCategoriesChildren]
  );

  const handleAllClose = useCallback(() => {
    setCheckedCategoriesParents([]);
    setCheckedCategoriesChildren({});
  }, [setCheckedCategoriesChildren, setCheckedCategoriesParents]);

  return !isEmpty ? (
    <Stack style={{ marginTop: 16 }}>
      <Badge onClose={handleAllClose} allClicable>
        <Text strong>Clear all</Text>
      </Badge>
      {initCategories?.map((item) => {
        const isAllCategories =
          item?.children?.length === checkedCategoriesChildren[item.id]?.length;
        const checkedItems = checkedCategoriesChildren[item?.id];

        if (checkedItems?.length > 0 || isAllCategories) {
          return <CategoryBadges key={item.id} parentItem={item} />;
        }
        return null;
      })}
    </Stack>
  ) : null;
});
