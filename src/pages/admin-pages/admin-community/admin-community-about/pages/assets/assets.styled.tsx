import { Collapse as AntdCollapse } from 'antd';
import styled, { css } from 'styled-components';

const draggableCss = css`
  margin-bottom: 24px;
`;

export const Collapse = styled(AntdCollapse)<{ $isDraggable: boolean }>`
  .ant-collapse-item {
    & .ant-collapse-header {
      align-items: center;
      background: white;
      border-radius: 8px !important;
    }
  }

  .ant-table-column-sorters {
    justify-content: flex-start;
  }

  .ant-table-column-title {
    flex: none;
    margin-right: ${(props) => props.theme.spacing.extraTight};
  }
  flex: 1;
  max-width: calc(100% - ${(props) => (props.$isDraggable ? 36 : 0)}px);
  ${({ $isDraggable }) => ($isDraggable ? draggableCss : '')}
`;
