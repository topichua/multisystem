import { Collapse } from 'antd';

import styled from 'styled-components';

export const StyledCollapse = styled(Collapse)`
  background: ${(props) =>
    props.theme.colors.components.background.whiteBackground};

  .ant-collapse {
    &-item {
      border-radius: 8px;
      border-bottom: none;

      &-active {
        margin-bottom: 24px;
        background: ${(props) =>
          props.theme.colors.components.background.tagBackgroundColor};
      }
    }

    &-header {
      padding: 16px 12px !important;

      &-text {
        color: ${(props) => props.theme.colors.components.colors.mono800};
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 28px;
      }
    }

    &-content-box {
      padding: 0 12px 16px 12px !important;
    }
  }
`;
