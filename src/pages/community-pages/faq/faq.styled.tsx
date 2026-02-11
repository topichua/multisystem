import styled from 'styled-components';
import { Collapse as AntCollapse } from 'antd';

export const Collapse = styled(AntCollapse)`
  background-color: transparent;

  .ant-collapse-item {
    margin-bottom: 24px;
    border-radius: ${(props) => props.theme.radius.large};
    border: none;
    background-color: rgba(0, 0, 0, 0.02);
  }

  .ant-collapse-header-text {
    font-size: ${(props) => props.theme.fontSize.large};
    font-weight: 600;
  }
`;
