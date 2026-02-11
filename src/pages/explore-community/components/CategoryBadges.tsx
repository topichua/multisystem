import { Typography } from 'antd';
import { observer } from 'mobx-react';
import { useCallback, useMemo } from 'react';
import { Badge } from 'src/components/common/Badge/Badge.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { useExploreCommunityStore } from 'src/pages/explore-community/explore-communities.provider.tsx';
import { CommunitiyCategoryDto } from 'src/transport/communities/communities.dto.ts';
import { ParentCategory } from 'src/utils/parseCategories.ts';

const { Text } = Typography;

interface CategoryBadgesProps {
  parentItem: ParentCategory;
}

export const CategoryBadges = observer(
  ({ parentItem }: CategoryBadgesProps) => {
    const {
      checkedCategoriesParents,
      checkedCategoriesChildren,
      setCheckedCategoriesParents,
      setCheckedCategoriesChildren,
    } = useExploreCommunityStore();

    const removeParentFromChecked = useCallback(() => {
      setCheckedCategoriesParents(
        checkedCategoriesParents.filter((item) => item.id !== parentItem.id)
      );
    }, [checkedCategoriesParents, parentItem.id, setCheckedCategoriesParents]);

    const handleParentClose = useCallback(() => {
      removeParentFromChecked();
      const updatedChildren = { ...checkedCategoriesChildren };
      delete updatedChildren[parentItem.id];
      setCheckedCategoriesChildren(updatedChildren);
    }, [
      removeParentFromChecked,
      checkedCategoriesChildren,
      parentItem.id,
      setCheckedCategoriesChildren,
    ]);

    const handleChildClose = useCallback(
      (child: CommunitiyCategoryDto) => {
        const updatedChildren = {
          ...checkedCategoriesChildren,
          [parentItem.id]:
            checkedCategoriesChildren[parentItem.id]?.filter(
              (item) => item.id !== child.id
            ) || [],
        };

        if (updatedChildren[parentItem.id].length === 0) {
          removeParentFromChecked();
        }

        setCheckedCategoriesChildren(updatedChildren);
      },
      [
        checkedCategoriesChildren,
        parentItem.id,
        removeParentFromChecked,
        setCheckedCategoriesChildren,
      ]
    );

    const isAllCategories = useMemo(() => {
      return (
        parentItem.children?.length ===
        checkedCategoriesChildren[parentItem.id]?.length
      );
    }, [parentItem, checkedCategoriesChildren]);

    const checkedItems = useMemo(() => {
      return checkedCategoriesChildren[parentItem.id];
    }, [checkedCategoriesChildren, parentItem.id]);

    return (
      <Stack>
        {isAllCategories ? (
          <Badge onClose={handleParentClose}>
            <Text strong>All: {parentItem.name}</Text>
          </Badge>
        ) : (
          checkedItems?.map((item) => (
            <Badge key={item.id} onClose={() => handleChildClose(item)}>
              <Text strong>{item.name}</Text>
            </Badge>
          ))
        )}
      </Stack>
    );
  }
);
