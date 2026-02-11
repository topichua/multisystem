import { PlusCircle } from '@untitled-ui/icons-react';
import { Card, Flex } from 'antd';
import { Dispatch, FC, SetStateAction } from 'react';

import { Title } from 'src/components/common/Typography/Title';
import { spacingDefinition } from 'src/styled/definitions/spacing';
import { CommunitiyCategoryDto } from 'src/transport/communities/communities.dto';

import { SubCategoryButton } from '../categories-table/categories-table.styled';

import * as S from './sub-category-table.styled';

type SubCategoryTableProps = {
  subcategory: CommunitiyCategoryDto;
  setCategoryForEdit: Dispatch<
    SetStateAction<Partial<CommunitiyCategoryDto> | null>
  >;
  setCategoryForDelete: Dispatch<SetStateAction<CommunitiyCategoryDto | null>>;
};
export const SubCategoryTable: FC<SubCategoryTableProps> = ({
  subcategory,
  setCategoryForEdit,
  setCategoryForDelete,
}) => {
  return (
    <S.SubCategoryWrapper
      vertical
      justify="stretch"
      gap={spacingDefinition.normal}
    >
      <S.StyledExpandableCard bordered size="small">
        <Flex vertical>
          <Flex align="center" justify="space-between">
            <Title
              level={5}
            >{`Subcategories: ${subcategory?.subCategoriesCount}`}</Title>

            <SubCategoryButton
              onClick={() =>
                setCategoryForEdit({ parentCategoryId: subcategory?.id })
              }
              type="primary"
              icon={<PlusCircle width={18} height={18} />}
            >
              Create subcategory
            </SubCategoryButton>
          </Flex>
        </Flex>
      </S.StyledExpandableCard>
      <Card style={{ padding: 4 }} size="small">
        <S.StyledTable
          categories={subcategory?.subCategories}
          currentPage={1}
          total={subcategory?.subCategoriesCount}
          onChangeCurrentPage={() => {}}
          onEditCategory={(category) => setCategoryForEdit(category)}
          onDeleteCategory={(category) => setCategoryForDelete(category)}
          pagination={false}
          scroll={{ x: 1100 }}
        />
      </Card>
    </S.SubCategoryWrapper>
  );
};
