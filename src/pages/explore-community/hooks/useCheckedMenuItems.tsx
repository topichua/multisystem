import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useCallback, useMemo } from 'react';
import { CommunitiyCategoryDto } from 'src/transport/communities/communities.dto.ts';
import { ParentCategory } from 'src/utils/parseCategories.ts';
import { useCheckedItems } from './useCheckedItems.ts';
import * as S from './useCheckedMenuItems.styled.ts';

export const useCheckedMenuItems = (
  parentItems: ParentCategory[],
  checkedCategoriesParents: ParentCategory[],
  checkedCategoriesChildren: Record<string, CommunitiyCategoryDto[]>,
  setCheckedCategoriesParents: (items: ParentCategory[]) => void,
  setCheckedCategoriesChildren: (
    items: Record<string, CommunitiyCategoryDto[]>
  ) => void
) => {
  const { handleParentCheck, handleChildCheck, indeterminate } =
    useCheckedItems(
      checkedCategoriesParents,
      checkedCategoriesChildren,
      setCheckedCategoriesParents,
      setCheckedCategoriesChildren
    );

  const getChildrenItems = useCallback(
    (parentItem: ParentCategory) =>
      parentItem.children.map((item) => {
        const isChecked =
          checkedCategoriesChildren[parentItem.id]?.some(
            (c) => c.id === item.id
          ) || false;
        return {
          key: item.id,
          label: item.name,
          icon: (
            <S.StyledCheckbox
              key={item.id}
              checked={isChecked}
              onChange={(e) =>
                handleChildCheck(parentItem, item, e.target.checked)
              }
            />
          ),
          onClick: () => handleChildCheck(parentItem, item, !isChecked),
        };
      }),
    [checkedCategoriesChildren, handleChildCheck]
  );

  const getParentItems = useCallback(
    (parentItem: ParentCategory) => ({
      key: parentItem.id,
      label: parentItem.name,
      icon: (
        <S.StyledCheckboxMain
          indeterminate={indeterminate(parentItem)}
          onClick={(e) => e.stopPropagation()}
          onChange={(e: CheckboxChangeEvent) =>
            handleParentCheck(parentItem, e.target.checked)
          }
          checked={checkedCategoriesParents.includes(parentItem)}
        />
      ),
      onClick: (e: unknown) => {
        if (parentItem.children.length) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          e.stopPropagation();
        }
        handleParentCheck(
          parentItem,
          !checkedCategoriesParents.includes(parentItem)
        );
      },
      ...(parentItem.children.length
        ? { children: getChildrenItems(parentItem) }
        : {}),
    }),
    [
      checkedCategoriesParents,
      indeterminate,
      handleParentCheck,
      getChildrenItems,
    ]
  );

  const menuItems = useMemo(
    () => parentItems.map(getParentItems),
    [parentItems, getParentItems]
  );

  return { menuItems };
};
