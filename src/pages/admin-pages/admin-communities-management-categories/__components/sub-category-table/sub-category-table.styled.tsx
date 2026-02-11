import { Card, Flex } from 'antd';
import { styled } from 'styled-components';

import { CategoriesTable } from '../../__components/categories-table/categories-table';

export const SubCategoryWrapper = styled(Flex)`
  width: 100%;
  padding: 16px;

  background-color: ${({
    theme: {
      colors: {
        components: {
          background: { mono100 },
        },
      },
    },
  }) => `${mono100} !important`};
  border-radius: ${(props) =>
    `0 0 ${props.theme.radius.large} ${props.theme.radius.large} !important`};
  z-index: 0;
  & > * {
    width: 100%;
  }
`;

export const StyledTable = styled(CategoriesTable)`
  & .ant-table {
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  & .ant-table-cell {
    background-color: white !important;
  }
`;

export const StyledExpandableCard = styled(Card)`
  width: 100% !important;
  border: 1px solid
    ${({ theme: { colors } }) => colors.components.border.primaryBorder} !important;
  padding: ${({ theme: { spacing } }) => `0px ${spacing.loose}`} !important;
  border-radius: ${({ theme: { radius } }) => `${radius.large}`};
`;
