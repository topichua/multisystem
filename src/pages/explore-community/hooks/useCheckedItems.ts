import { useCallback } from 'react';
import { CommunitiyCategoryDto } from 'src/transport/communities/communities.dto.ts';
import { ParentCategory } from 'src/utils/parseCategories.ts';

export const useCheckedItems = (
  checkedCategoriesParents: ParentCategory[],
  checkedCategoriesChildren: Record<string, CommunitiyCategoryDto[]>,
  setCheckedCategoriesParents: (items: ParentCategory[]) => void,
  setCheckedCategoriesChildren: (
    items: Record<string, CommunitiyCategoryDto[]>
  ) => void
) => {
  const updateCheckedParents = useCallback(
    (parent: ParentCategory, shouldCheck: boolean) => {
      const prev = checkedCategoriesParents;
      setCheckedCategoriesParents(
        shouldCheck
          ? [...prev, parent]
          : prev.filter((item) => item.id !== parent.id)
      );
    },
    [checkedCategoriesParents, setCheckedCategoriesParents]
  );

  const handleParentCheck = useCallback(
    (parent: ParentCategory, checked: boolean) => {
      updateCheckedParents(parent, checked);
      const updatedChildren = { ...checkedCategoriesChildren };
      if (checked) {
        updatedChildren[parent.id] = parent.children;
      } else {
        delete updatedChildren[parent.id];
      }
      setCheckedCategoriesChildren(updatedChildren);
    },
    [
      checkedCategoriesChildren,
      setCheckedCategoriesChildren,
      updateCheckedParents,
    ]
  );

  const handleChildCheck = useCallback(
    (
      parent: ParentCategory,
      child: CommunitiyCategoryDto,
      checked: boolean
    ) => {
      const prevChecked = checkedCategoriesChildren;
      const updatedChildren = {
        ...prevChecked,
        [parent.id]: checked
          ? [...(prevChecked[parent.id] || []), child]
          : prevChecked[parent.id]?.filter((item) => item.id !== child.id) ||
            [],
      };

      if (
        checked &&
        updatedChildren[parent.id].length === parent.children.length
      ) {
        updateCheckedParents(parent, true);
      } else if (!checked && updatedChildren[parent.id].length === 0) {
        updateCheckedParents(parent, false);
      }

      setCheckedCategoriesChildren(updatedChildren);
    },
    [
      checkedCategoriesChildren,
      setCheckedCategoriesChildren,
      updateCheckedParents,
    ]
  );

  const indeterminate = useCallback(
    (parent: ParentCategory) => {
      const children = checkedCategoriesChildren[parent.id] || [];
      return children.length > 0 && children.length < parent.children.length;
    },
    [checkedCategoriesChildren]
  );

  return {
    handleParentCheck,
    handleChildCheck,
    indeterminate,
  };
};
