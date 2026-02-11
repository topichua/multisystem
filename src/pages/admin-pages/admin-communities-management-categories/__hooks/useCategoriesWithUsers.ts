import { useMemo } from 'react';
import { useGetUsersByIds } from 'src/pages/community-pages/communities-home-feed/__hooks/useGetUsersByIds';
import { CommunitiyCategoryDto } from 'src/transport/communities/communities.dto';

export const useCategoriesWithUsers = (categories: CommunitiyCategoryDto[]) => {
  const usersIds = useMemo(() => {
    return categories.map((c) => c.createdByUserId);
  }, [categories]);

  const { users, isLoading } = useGetUsersByIds(usersIds);

  const categoriesWithUsers = useMemo(() => {
    return categories.map((c) => ({
      ...c,
      createdBy: users[c.createdByUserId],
    }));
  }, [users, categories]);

  return { categories: categoriesWithUsers, isLoading };
};
