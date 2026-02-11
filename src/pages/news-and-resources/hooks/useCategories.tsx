import { useRequest } from 'ahooks';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { newsApi } from 'src/transport/news/news.api';
import {
  GetSingleItemParams,
  NewsCategoryDTO,
} from 'src/transport/news/news.dto';
import { ResourceCategoryDTO } from 'src/transport/resources/resources.dto';

import { pagesMap } from '../../authorized/routes';

import * as U from '../utils/utils';

export const useCategories = (
  getCategoryById:
    | ((
        id: string,
        params?: GetSingleItemParams
      ) => Promise<{
        data: NewsCategoryDTO | ResourceCategoryDTO;
      }>)
    | undefined = newsApi.getNewsCategoryById,
  navigateTo: string | undefined = `${pagesMap.news}/${U.ALL_CATEGORIES_PARAM}`
) => {
  const navigate = useNavigate();
  const categoryId = useParams()?.categoryId;

  const isDefaultCategory = useMemo(
    () => categoryId === U.ALL_CATEGORIES_PARAM,
    [categoryId]
  );

  const {
    data: selectedCategoryData,
    loading: isSelectedCategoryLoading,
    error: selectedCategoryError,
    mutate,
  } = useRequest(() => getCategoryById(`${categoryId}`), {
    manual: !categoryId || isDefaultCategory,
    refreshDeps: [categoryId],
    debounceWait: 200,
  });

  useEffect(() => {
    isDefaultCategory &&
      mutate((data) => {
        const name = data?.data?.id?.toString();
        return { data: { label: name?.replace(/./g, ' '), id: 1 } };
      });
  }, [isDefaultCategory, mutate]);

  const handleResetCategories = useCallback(
    () => navigate(navigateTo),
    [navigate, navigateTo]
  );

  const showAllCategoriesButton = useMemo(
    () => !categoryId || !isDefaultCategory,
    [categoryId, isDefaultCategory]
  );

  const innerHeaderTitle = useMemo(() => {
    switch (true) {
      case isDefaultCategory:
        return '';

      case !isDefaultCategory && isSelectedCategoryLoading:
        return '';

      case !isSelectedCategoryLoading && !selectedCategoryError:
        return (selectedCategoryData?.data as NewsCategoryDTO)?.label;

      default:
        return '';
    }
  }, [
    isDefaultCategory,
    isSelectedCategoryLoading,
    selectedCategoryData,
    selectedCategoryError,
  ]);

  return useMemo(
    () => ({
      handleResetCategories,
      showAllCategoriesButton,
      categoryId,
      selectedCategoryData,
      isSelectedCategoryLoading,
      isDefaultCategory,
      innerHeaderTitle,
    }),
    [
      categoryId,
      isDefaultCategory,
      handleResetCategories,
      isSelectedCategoryLoading,
      selectedCategoryData,
      showAllCategoriesButton,
      innerHeaderTitle,
    ]
  );
};
