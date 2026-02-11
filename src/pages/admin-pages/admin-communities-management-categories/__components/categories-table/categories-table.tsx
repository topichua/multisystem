import {
  Button,
  TableColumnsType,
  TableProps,
  Tooltip,
  Typography,
} from 'antd';

import { Stack } from 'src/components/common/Stack/Stack';
import { CommunitiyCategoryDto } from 'src/transport/communities/communities.dto';

import { formatDate } from 'src/utils/date-time';
import { PAGE_SIZE } from '../../admin-communities-management-categories';

import { PlusCircle } from '@untitled-ui/icons-react';
import { spacingDefinition } from 'src/styled/definitions/spacing';
import * as S from './categories-table.styled';

const { Text } = Typography;

type CategoriesTableProps = {
  categories: CommunitiyCategoryDto[];
  currentPage: number;
  total: number;
  onChangeCurrentPage: (page: number) => void;
  onDeleteCategory: (category: CommunitiyCategoryDto) => void;
  onEditCategory: (category: CommunitiyCategoryDto) => void;
  columns?: (
    columns: TableColumnsType<CommunitiyCategoryDto>
  ) => TableColumnsType<CommunitiyCategoryDto>;
  addSubCategory?: (parentCategoryId: string) => void;
} & Omit<TableProps<CommunitiyCategoryDto>, 'columns' | 'dataSource'>;

export const CategoriesTable = ({
  categories,
  currentPage,
  total,
  onChangeCurrentPage,
  onDeleteCategory,
  onEditCategory,
  columns: _columns,
  addSubCategory,
  ...tableProps
}: CategoriesTableProps) => {
  const columns: TableColumnsType<CommunitiyCategoryDto> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (_, category) => (
        <Text style={{ color: category.color }}>{category.name}</Text>
      ),
    },
    {
      title: 'Number of communities',
      dataIndex: 'Number of communities',
      key: 'Number of communities',
      width: 240,
      render: (_, category) => <Text>{category.communityCount}</Text>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      render: (_, category) => <Text>{category.description ?? '-'}</Text>,
    },
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (_, category) => (
        <Text type="secondary">{formatDate(category.createdAt)}</Text>
      ),
    },
    {
      title: 'Created by',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 250,
      render: (_, category) =>
        category.createdBy ? (
          <Text>
            {category.createdBy?.firstName} {category.createdBy?.lastName}
          </Text>
        ) : (
          '-'
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 280,
      render: (_, category) => (
        <Stack>
          <Button onClick={() => onEditCategory(category)}>Edit</Button>

          <Button danger onClick={() => onDeleteCategory(category)}>
            Delete
          </Button>

          {addSubCategory && (
            <Tooltip title="Add subcategory" trigger="hover">
              <S.SubCategoryButton
                icon={
                  <PlusCircle
                    width={spacingDefinition.loose}
                    height={spacingDefinition.loose}
                  />
                }
                type="primary"
                style={{
                  paddingRight: spacingDefinition.extraLoose,
                  paddingLeft: spacingDefinition.extraLoose,
                }}
                onClick={() => addSubCategory(category.id)}
              />
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <S.StyledTable
      dataSource={categories}
      rowKey="id"
      columns={_columns?.(columns) ?? columns}
      pagination={{
        position: ['bottomCenter'],
        total,
        pageSize: PAGE_SIZE,
        current: currentPage,
        onChange: onChangeCurrentPage,
      }}
      {...(tableProps || {})}
    />
  );
};
