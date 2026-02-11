import { Collapse } from 'antd';
import { styled } from 'styled-components';
import { AppleOutlined } from '@ant-design/icons';
import GoogleOutlined from 'src/assets/icons/google-outline.svg?react';

export const StyledCollapse = styled(Collapse)`
  .ant-collapse-header {
    padding: 3px 0 !important;
    align-items: center !important;
  }

  .ant-collapse-content-box {
    padding: 0 !important;

    .ant-btn {
      padding: 0 0 5px 28px !important;
    }
  }
`;

export const StyledGoogle = styled(GoogleOutlined)`
  width: 18px;
  height: 18px;
  color: #344054;
  margin: 7px 1px 0 -3px;
`;

export const StyledApple = styled(AppleOutlined)`
  svg {
    width: 18px;
    height: 18px;
    color: #344054;
    margin: 2px 1px 0 -3px;
  }
`;
