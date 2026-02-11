import { styled } from 'styled-components';
import { Collapse as AntdCollapse } from 'antd';

export const Collapse = styled(AntdCollapse)`
  &.ant-collapse {
    overflow: hidden;
  }

  .ant-collapse-header {
    align-items: center !important;
    background-color: ${(props) =>
      props.theme.colors.components.background.whiteBackground};
  }
`;
