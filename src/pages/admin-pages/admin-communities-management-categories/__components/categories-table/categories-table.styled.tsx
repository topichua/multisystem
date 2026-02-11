import { Button, Table } from 'antd';
import { CommunitiyCategoryDto } from 'src/transport/communities/communities.dto';
import styled from 'styled-components';

export const StyledTable = styled(Table<CommunitiyCategoryDto>)`
  & .ant-table-expanded-row {
    & > .ant-table-cell {
      padding: 0 !important;
      background-color: transparent !important;
    }
  }
`;
export const SubCategoryButton = styled(Button)`
  & * {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: ${(props) => props.theme.spacing.normal} !important;
  }
`;
