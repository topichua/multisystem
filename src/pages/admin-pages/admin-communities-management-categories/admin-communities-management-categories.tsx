import { useBoolean, usePagination } from 'ahooks';
import { Empty, Skeleton, Typography, notification } from 'antd';
import { AxiosError } from 'axios';
import { useCallback, useMemo, useState } from 'react';

import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';
import { communityApi } from 'src/transport/communities/communities.api';
import { CommunitiyCategoryDto } from 'src/transport/communities/communities.dto';

import { PageContent } from '../admin-pages-layout.styled';

import { CategoriesTable } from './__components/categories-table/categories-table';
import {
  CategoryFormValues,
  CreateCategoryModal,
} from './__components/create-category-modal/create-category-modal';
import { useCategoriesWithUsers } from './__hooks/useCategoriesWithUsers';

import { Menu03, PlusCircle } from '@untitled-ui/icons-react';
import { SubCategoryTable } from './__components';
import { SubCategoryButton } from './__components/categories-table/categories-table.styled';
import * as S from './admin-communities-management-categories.styled';

const { Text } = Typography;

export const PAGE_SIZE = 10;

export const AdminCommunitiesManagementCategories = () => {
  const [totalItemCount, setTotalItemCount] = useState<number | null>(null);

  const {
    data,
    error,
    loading,
    pagination,
    refreshAsync: refreshCategories,
  } = usePagination(
    ({ current }) => {
      return communityApi
        .getAllCategories(current, PAGE_SIZE, true)
        .then(({ communityCategories, totalItemCount }) => {
          setTotalItemCount(totalItemCount);
          return {
            list: communityCategories,
            total: totalItemCount,
          };
        });
    },
    { defaultPageSize: PAGE_SIZE }
  );

  const { categories } = useCategoriesWithUsers(data?.list || []);

  const [
    isActionCategoryLoading,
    { setTrue: showActionCategoryLoading, setFalse: hideActionCategoryLoading },
  ] = useBoolean(false);

  const [categoryForEdit, setCategoryForEdit] =
    useState<Partial<CommunitiyCategoryDto> | null>(null);
  const [categoryForDelete, setCategoryForDelete] =
    useState<CommunitiyCategoryDto | null>(null);

  const handleCreateOrUpdateCategory = (data: CategoryFormValues) => {
    const request = !data.id
      ? communityApi.createCategory
      : communityApi.editCategory;

    showActionCategoryLoading();
    request({
      ...data,
      color: data.color.toHexString(),
      parentCategoryId: data?.parentCategoryId,
    })
      .then(() => {
        refreshCategories();
        hideActionCategoryLoading();
        setCategoryForEdit(null);
      })
      .catch((e) => {
        notification.error({
          message: 'Error creating/editing category. Try again.',
          description: (e as AxiosError)?.message,
        });
      });
  };

  const handleDeleteCategory = () => {
    showActionCategoryLoading();
    communityApi
      .deleteCategory(categoryForDelete?.id as string)
      .then(() => {
        refreshCategories();
        hideActionCategoryLoading();
        setCategoryForDelete(null);
      })
      .catch((e) => {
        notification.error({
          message: 'Error deleting category. Try again.',
          description: (e as AxiosError)?.message,
        });
      });
  };

  const addSubCategory = useCallback((parentCategoryId: string) => {
    setCategoryForEdit({ parentCategoryId });
  }, []);

  const content = useMemo(() => {
    if (loading) {
      return <Skeleton active />;
    }

    if (error) {
      return <Text type="danger">{error?.message}</Text>;
    }

    if (!data || data.list.length === 0) {
      return (
        <Empty description="No categories yet" style={{ paddingTop: 24 }} />
      );
    }

    return (
      <>
        <CategoriesTable
          categories={categories}
          currentPage={pagination.current}
          total={pagination.total}
          scroll={{ x: 1180 }}
          onChangeCurrentPage={(page) => pagination.onChange(page, 0)}
          onDeleteCategory={(category) => setCategoryForDelete(category)}
          onEditCategory={(category) => setCategoryForEdit(category)}
          addSubCategory={addSubCategory}
          expandable={{
            expandedRowRender: (record) => (
              <SubCategoryTable
                subcategory={record}
                setCategoryForDelete={setCategoryForDelete}
                setCategoryForEdit={setCategoryForEdit}
              />
            ),
            rowExpandable: (record) => !!record?.subCategoriesCount,
          }}
        />
      </>
    );
  }, [loading, error, data, categories, pagination, addSubCategory]);

  return (
    <>
      <InnerPageHeader
        icon={<Menu03 />}
        title={
          <>Categories {totalItemCount != null ? ` (${totalItemCount})` : ''}</>
        }
      >
        <S.HeaderWrapper>
          <SubCategoryButton
            type="primary"
            icon={<PlusCircle width={18} height={18} />}
            onClick={() => setCategoryForEdit({})}
          >
            Create category
          </SubCategoryButton>
        </S.HeaderWrapper>
      </InnerPageHeader>
      <PageContent>
        {content}

        <CreateCategoryModal
          isOpen={!!categoryForEdit}
          category={categoryForEdit}
          isLoading={isActionCategoryLoading}
          onClose={() => setCategoryForEdit(null)}
          onCreateOrUpdate={handleCreateOrUpdateCategory}
        />

        <ConfirmModal
          isOpen={!!categoryForDelete}
          confirmButtonProps={{ danger: true }}
          title="Are you sure you want to delete this category"
          isLoading={isActionCategoryLoading}
          confirmButtonText="Delete"
          onClose={() => setCategoryForDelete(null)}
          onConfirm={handleDeleteCategory}
        />
      </PageContent>
    </>
  );
};
