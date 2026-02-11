import { CommunitiyCategoryDto } from 'src/transport/communities/communities.dto.ts';

export interface ParentCategory extends CommunitiyCategoryDto {
  children: CommunitiyCategoryDto[];
}

export const parseCategories = (
  categories: CommunitiyCategoryDto[]
): ParentCategory[] => {
  const categoryMap: Record<string, ParentCategory> = {};

  categories.forEach((category) => {
    if (!categoryMap[category.id]) {
      categoryMap[category.id] = { ...category, children: [] };
    }
  });

  categories.forEach((category) => {
    if (category.parentCategoryId) {
      if (categoryMap[category.parentCategoryId]) {
        categoryMap[category.parentCategoryId].children.push(category);
      }
    }
  });

  return Object.values(categoryMap).filter(
    (category) => category.parentCategoryId === null
  );
};
